package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

type healthResponse struct {
	Status string `json:"status"`
}

func main() {
	addr := env("APP_ADDR", ":8080")
	webDir := env("APP_WEB_DIR", "../frontend")
	flag.StringVar(&addr, "addr", addr, "HTTP listen address")
	flag.StringVar(&webDir, "web-dir", webDir, "directory with frontend assets")
	flag.Parse()

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", health())
	mux.Handle("/", spa(webDir))

	server := &http.Server{
		Addr:              addr,
		Handler:           accessLog(mux),
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	errc := make(chan error, 1)
	go func() {
		log.Printf("listening on %s, serving web from %s", addr, webDir)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errc <- err
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errc:
		log.Fatalf("http server: %v", err)
	case sig := <-stop:
		log.Printf("shutdown: received %s", sig)
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown: http: %v", err)
	}
}

func health() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(healthResponse{Status: "ok"}); err != nil {
			log.Printf("health: encode: %v", err)
		}
	}
}

func spa(webDir string) http.Handler {
	files := http.FileServer(http.Dir(webDir))
	index := filepath.Join(webDir, "index.html")

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		cleanPath := filepath.Clean(strings.TrimPrefix(r.URL.Path, "/"))
		if strings.HasPrefix(cleanPath, "..") {
			http.NotFound(w, r)
			return
		}
		if cleanPath == "." {
			cleanPath = "index.html"
		}
		target := filepath.Join(webDir, cleanPath)
		if info, err := os.Stat(target); err == nil && !info.IsDir() {
			files.ServeHTTP(w, r)
			return
		}

		http.ServeFile(w, r, index)
	})
}

func accessLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start).Round(time.Millisecond))
	})
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
