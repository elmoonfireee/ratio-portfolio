# Model projektów Storyblok dla RATIO Smart Innovations

**Aktualny stan:** portfolio jest wyłączone. Sekcja na stronie głównej jest
ukryta, a trasy `/pl/realizacje`, `/en/projects` oraz ich strony szczegółów
przekierowują na odpowiednie strony główne. Publikacja story nie sprawi obecnie,
że projekt będzie widoczny na stronie. Poniższy opis dotyczy przygotowanego
modelu i kodu integracji; przed ponownym włączeniem portfolio wymagają one
osobnej weryfikacji.

Storyblok jest przygotowany w aplikacji wyłącznie do zarządzania projektami portfolio.
Usługi są utrzymywane lokalnie w kodzie i plikach tłumaczeń.

Integracja odczytuje tylko opublikowaną treść przez Content Delivery API w
regionie EU. Nie używa Management API, CLI, Space ID ani tokenu zarządzającego.
Nie usuwa ani nie modyfikuje zdalnych stories, folderów lub bloków. Podgląd
roboczy i Visual Editor nie są częścią tego etapu.

## 1. Języki przestrzeni

1. W Storyblok otwórz **Settings → Internationalization**.
2. Pozostaw polski jako język domyślny przestrzeni i wpisuj w nim treść polską.
3. Dodaj język dodatkowy z kodem `en`.
4. Dla każdego pola oznaczonego niżej jako tłumaczalne włącz **Translatable**.
5. W angielskiej wersji story uzupełnij angielską treść. Bez tłumaczenia
   Storyblok zwróci domyślną wartość polską.
6. Używaj tego samego slugu w obu językach. Kod zawiera lokalizowane trasy
   `/pl/realizacje/...` oraz `/en/projects/...`, które obecnie przekierowują.

## 2. Content type `project`

W **Block Library** utwórz content type o technicznej nazwie `project`:

| Nazwa techniczna | Typ pola | Tłumaczenie | Uwagi |
| --- | --- | --- | --- |
| `title` | Text | tak | wymagane |
| `short_description` | Textarea | tak | wymagany opis karty |
| `full_description` | Rich text | tak | wymagany pełny opis |
| `category` | Single-option | tak, jeśli panel pozwala | wartość widoczna w filtrze |
| `status` | Single-option | nie | wymagane: `demo`, `coming_soon` lub `completed` |
| `service_region` | Text | tak | ogólny region, bez prywatnego adresu |
| `year` | Number | nie | rok realizacji |
| `scope_of_work` | Textarea lub Rich text | tak | jeden punkt w osobnej linii |
| `technologies` | Multi-option lub list | nie | nazwy technologii |
| `smart_functions` | Multi-option lub list | tak | wybrane funkcje |
| `featured_image` | Asset | nie | obraz główny z tekstem alternatywnym |
| `gallery` | Multi-asset | nie | galeria z tekstami alternatywnymi |
| `seo_title` | Text | tak | opcjonalne |
| `seo_description` | Textarea | tak | opcjonalne |
| `noindex` | Boolean | nie | blokuje indeksowanie niezależnie od statusu |

Opcje pola `status`:

- `demo` — projekt demonstracyjny,
- `coming_soon` — zapowiedź,
- `completed` — zweryfikowana, zakończona realizacja.

Tylko potwierdzone realizacje mogą otrzymać status `completed`. Projekty
`demo` i `coming_soon` są oznaczane w interfejsie oraz automatycznie wyłączane
z indeksowania. Nie publikuj zmyślonych klientów, opinii, adresów,
certyfikatów, wyników ani zdjęć.

## 3. Folder projektów

1. Otwórz **Content**.
2. W katalogu głównym utwórz folder `projects` ze slugiem `projects`, jeżeli
   jeszcze nie istnieje.
3. Stories projektów umieszczaj bezpośrednio w tym folderze.

Kod integracji pobiera wyłącznie opublikowane stories zaczynające się od
`projects/`. Inne foldery i typy treści są ignorowane.

## 4. Dodawanie nowego projektu — instrukcja dla edytora

1. Wejdź do folderu **projects**.
2. Kliknij **Create new → Story**.
3. Wybierz content type **project**.
4. Nadaj projektowi krótki, trwały slug z małych liter, cyfr i łączników, np.
   `dom-jednorodzinny-poznan`. Slug jest przewidziany jako część adresu strony
   po ponownym włączeniu portfolio; nie zmieniaj go bez planu przekierowania.
5. Uzupełnij wymagane pola po polsku: tytuł, krótki opis, pełny opis i status.
6. Dodaj region, rok, zakres prac, technologie i funkcje, jeśli są dostępne.
7. Dodaj obraz główny oraz opcjonalną galerię. Przy każdym obrazie wpisz
   rzeczowy tekst alternatywny i upewnij się, że RATIO ma prawo do publikacji.
8. Pozostaw status `demo` lub `coming_soon`, dopóki materiały i realizacja nie
   zostaną zweryfikowane. Dopiero wtedy wybierz `completed`.
9. Przełącz język na `en` i uzupełnij wszystkie pola tłumaczalne.
10. Włącz `noindex`, jeśli projekt nie powinien trafić do wyszukiwarki.
11. Sprawdź obie wersje językowe i kliknij **Publish**. Samo zapisanie draftu
    nie udostępnia projektu w aplikacji.

Kod integracji przewiduje dodanie opublikowanego slugu do danych portfolio.
Obecnie jednak adresy `/pl/realizacje/<slug>` i `/en/projects/<slug>`
przekierowują na strony główne, więc projekt nie jest pod nimi dostępny.

## 5. Zastępowanie lokalnego projektu

Kod łączenia danych zastępuje lokalny projekt projektem Storyblok o takim samym slugu.
Aktualne lokalne slugi:

- `smart-home-comfort-demo`
- `building-automation-coming-soon`
- `energy-it-infrastructure-demo`

Nowy slug dodaje projekt do wyniku łączenia, a nie usuwa lokalnych wpisów. Gdy
tokenu brakuje, Storyblok jest chwilowo niedostępny lub opublikowane dane są
niepoprawne, kod zwraca lokalne projekty awaryjne. Nie oznacza to, że obecnie
wyłączone portfolio jest widoczne na stronie.

## 6. Publikacja i aktualizacje

- Aplikacja nigdy nie pobiera wersji draft.
- Po zmianach zawsze kliknij **Publish**.
- Kod integracji ustawia rewalidację na 5 minut; zachowanie po ponownym
  włączeniu portfolio wymaga sprawdzenia w docelowym środowisku.
- Slug projektu jest wspólny dla języka polskiego i angielskiego.
- Aplikacja używa wyłącznie Content Delivery API i nie wykonuje zdalnego
  czyszczenia zawartości Storyblok.
- Podgląd draftów i Visual Editor zostaną skonfigurowane osobno.
