# RATIO Smart Innovations

Dwujęzyczna strona firmowa poświęcona automatyce budynkowej i inteligentnym instalacjom. Aplikacja prezentuje ofertę oraz formularz kontaktowy. Kod zawiera przygotowaną integrację Storyblok dla portfolio; **portfolio jest obecnie wyłączone**, a jego trasy przekierowują na strony główne.

## Technologie

- Next.js App Router, React i JavaScript/JSX.
- Tailwind CSS, lokalne słowniki PL/EN i metadane SEO.
- Route Handler dla formularza, Nodemailer oraz opcjonalny Sentry.
- Docker z wieloetapowym buildem i serwerem Next w trybie standalone.

## Uruchomienie lokalne

Wymagania: Node.js 22 i npm. Zestaw testów wymaga Node.js co najmniej 20.6; projekt sprawdzono na Node 22.13.0.

```bash
npm ci
npm run dev
```

Otwórz `http://localhost:3000`; `/` przekierowuje na `/pl`, dostępne jest również `/en`. Aplikacja uruchamia się bez skonfigurowanych usług zewnętrznych. Bez konfiguracji SMTP poprawnie wypełniony formularz otrzymuje kontrolowaną odpowiedź 503; żaden e-mail nie zostanie wysłany.

W razie potrzeby skopiuj `.env.example` do `.env.local` i uzupełnij tylko potrzebne zmienne. Nie umieszczaj poświadczeń w repozytorium. Zmienne `NEXT_PUBLIC_*` są przeznaczone do kodu dostępnego w przeglądarce.

## Weryfikacja

```bash
npm test
npm run lint
npm run build
npm run start
```

`npm test` uruchamia testy `node:test` dla handlera i walidacji formularza, middleware, CSP i etykiet. SMTP jest zastąpiony atrapą; testy nie dowodzą rzeczywistego dostarczenia poczty ani pełnej dostępności UI. Build i uruchomienie produkcyjne wykonuj z odpowiednio skonfigurowanym środowiskiem. Przy output: standalone lokalny npm run start może zgłosić ostrzeżenie Next; Docker uruchamia wygenerowany serwer standalone.

## Struktura

- `src/app/` — strony, layout, metadane i endpointy.
- `src/components/` oraz `src/hooks/` — komponenty i interakcje.
- `src/i18n/` i `messages/` — konfiguracja języków i teksty.
- `src/data/` i `src/lib/` — dane oraz przygotowane integracje.
- `public/` — zasoby używane przez aplikację.
- `tests/` — testy i atrapy; `Dockerfile` oraz `compose.yaml` — uruchamianie w kontenerze.

## Formularz i ograniczenia bezpieczeństwa

`POST /api/contact` ogranicza treść do 16 KiB, waliduje dane po stronie serwera, stosuje honeypot oraz zwraca kontrolowane odpowiedzi błędów. E-mail wymaga konfiguracji zmiennych `SMTP_*`; testy nie łączą się z prawdziwym SMTP.

**Ochrona per IP i konfiguracja zaufanego proxy są BLOCKED.** Obecny limit pięciu żądań na minutę jest wspólny dla wszystkich użytkowników jednego procesu; może zablokować pozostałych i nie jest współdzielony między instancjami. Aplikacja nie ufa `X-Forwarded-For`. Przed wdrożeniem należy ustalić topologię, zabezpieczyć bezpośredni dostęp, odpowiednio nadpisywać nagłówki, wdrożyć właściwy współdzielony limit oraz limity rozmiaru i czasu żądań na brzegu. Sama aplikacja nie jest uznana za gotową produkcyjnie.

## Storyblok i Sentry

Storyblok jest przygotowany do odczytu opublikowanych projektów z serwera i używa lokalnych danych awaryjnych. Sekcja realizacji jest ukryta, a trasy listy i szczegółów przekierowują; sama publikacja story nie włącza portfolio. Zobacz [model treści](docs/storyblok-content-model.md).

Sentry jest opcjonalny i wymaga konfiguracji DSN. Trasa testowa Sentry jest dostępna, gdy `SENTRY_TEST_ENABLED=true`; przed wdrożeniem należy upewnić się, że ta zmienna jest wyłączona. Nie weryfikowano rzeczywistych usług SMTP, Storyblok ani Sentry.

## Docker

```bash
docker build -t ratio-portfolio:local .
docker run --rm -p 3000:3000 ratio-portfolio:local
```

Można też użyć `docker compose up --build`; opcjonalna konfiguracja środowiska jest opisana w `compose.yaml`. `.dockerignore` wyklucza lokalne pliki środowiskowe, prywatną dokumentację, zależności i artefakty builda z kontekstu. Obraz aplikacji nie był w tym etapie testowany.
