# Onkostar Scriptsammlung "onkostar-cccmf-jsutils"

Eine Sammlung von JavaScript-Funktionen und Klassen zur Verwendung innerhalb von Onkostar-Formular-Scripten.

Diese Sammlung kann wie ein Onkostar-Plugin installiert werden, enthält jedoch keine Pluginfunktionalität.
Es stellt vielmehr eine Sammlung von JavaScript-Dateien bereit, die innerhalb von Onkostar verwendet werden können.

## Generelle Verwendung

Diese Sammlung von JavaScript-Funktionen weicht in einigen Punkten von der typischen Semantik für JavaScript ab,
da Onkostar intern den ExtJS ClassManager verwendet.

### Laden einer Klasse

Um eine in dieser Sammlung enthaltene Klasse zu laden wird die ExtJS-Funktion `syncRequire()` verwendet.
Hierzu wird der Klassenname mit dem Prefix `app.lib` übergeben.

In diesem Beispiel soll die Klasse `cccmf.FormUtils` geladen werden, also wird `app.lib.cccmf.FormUtils` übergeben.

Als zweiter Parameter wird die Funktion übergeben, die ausgeführt werden soll, wenn das Script geladen wurde.

```javascript
Ext.syncRequire('app.lib.cccmf.FormUtils', () => {
    // Diese Funktion wird ausgeführt, solbald das entsprechende Script geladen wurde
});
```

Innerhalb dieser Funktion haben Sie Zugriff auf die geladene Klasse. Hierzu wird nicht das JavaScript-Keyword `new`
verwendet,
sondern es muss der in Onkostar enthaltene `Ext.ClassManager` verwendet werden.
Dessen Funktion `get()` übergibt eine Repräsentation der geladenen Klasse - technisch genauer: eine Funktion,
welche ein JavaScript-Objekt übergibt.

Die Nutzung des Schlüsselworts `new` ist in Onkostar an dieser Stelle nicht möglich.
Um die Entwicklung einfacher zu gestalten, soll hier die Funktion `new()` verwendet werden,
die ähnlich dem Schlüsselwort `new` verwendet werden kann, um den Konstruktor aufzurufen.

Zuvor kann bereits geprüft werden, ob das Laden der Klasse erfolgreich war.

```javascript
Ext.syncRequire('app.lib.cccmf.FormUtils', () => {
    // Die ExtJS-Klasse 'cccmf.FormUtils' wird in Variable 'FormUtils' geladen.
    // Großschreibung um kenntlich zu machen, dass es eine Klasse ist.
    let FormUtils = Ext.ClassManager.get('cccmf.FormUtils');

    // Wenn `FormUtils === null`, ist die Klasse `cccmf.FormUtils` nicht möglich.
    if (FormUtils === null) {
        // Klasse konnte nicht geladen werden. Fehlermeldung und Ende.
        console.error("Klasse 'cccmf.Formutils' nicht verfügbar!")
        return;
    }

    // Eine Instanz der Klasse wird erstellt
    // Dies entspricht der Nutzung von `new FormUtils(this)` in neueren JavaScript-Codebasen.
    // `this` ist in diesem Zusammenhang das Formular, auf dem gearbeitet werden soll.
    let formUtils = FormUtils.new(this);

    // ... Verwendung und weiterer Code ...
});
```

## Die Klasse `cccmf.FormUtils`

Die Klasse `cccmf.FormUtils` stellt Hilfsfunktionen zur Verwendung in Onkostar bereit und erweitert damit bestehende
Funktionalität für Formularfelder.

### Verwendung der Hilfsfunktionen für Formulare

Sie können das Script in den Formularscripts von Formularfeldern wie folgt initialisieren und verwenden -
hier im Beispiel ohne Prüfung, ob die Klasse geladen wurde.

```javascript
// Laden des Scripts, wenn erforderlich
Ext.syncRequire('app.lib.cccmf.FormUtils', () => {
    // `this` ist in diesem Zusammenhang das Formular.
    let formUtils = Ext.ClassManager.get('cccmf.FormUtils').new(this);

    // Wert des Formularfelds `Start` explizit aus dem Hauptformular. Unterformulare werden ignoriert.
    // Dadurch verhält es sich anders als `getFieldValue()` von Onkostar, welches den ersten Treffer,
    // unter Umständen auch aus vorhergehenden Unterformularen verwendet.
    let value = formUtils.getMainformFieldValue('Start');

    // ... weiterer Code ...
});
```

### Verfügbare Methoden

#### `getMainformField(fieldName)`

Übergibt das komplette Feld mit Namen `fieldName` aus dem Hauptformular und ignoriert alle,
auch vorhergehende, Unterformularfelder mit gleichem Namen.

#### `getFieldAtIndex(fieldName, index)`

Übergibt das komplette Feld mit Namen `fieldName` auf Index `index` (nullbasiert), bezogen sowohl auf das Hauptformular
als
auch Unterformularfelder mit gleichem Namen.

#### `getFieldInSection(fieldName, sectionName)`

Übergibt das Feld mit Namen `fieldName` aus dem Bereich mit Namen `sectionName`.

Da es in Onkostar nicht möglich sein sollte, mehrere Formularfelder mit gleichem Namen in verschiedenen Bereichen eines
Hauptformulars zu platzieren, ist diese Funktion nur dann hilfreich, wenn sichergestellt sein soll, dass sich das
Formularfeld
in einem Bereich befindet.

#### `getMainformFieldValue(fieldName)`

Übergibt den Inhalt des Felds mit Namen `fieldName` aus dem Hauptformular und ignoriert alle,
auch vorhergehende, Unterformularfelder mit gleichem Namen.

Dadurch unterscheidet es sich von `getFieldValue()` von Onkostar, welches den ersten Treffer,
unter Umständen auch aus vorhergehenden Unterformularen verwendet.

#### `setMainformFieldValue(fieldName, newValue)`

Aktualisiert den Inhalt des Felds mit Namen `fieldName` aus dem Hauptformular und ignoriert alle,
auch vorhergehende, Unterformularfelder mit gleichem Namen.

Dadurch unterscheidet es sich von `setFieldValue()` von Onkostar, welches den ersten Treffer,
unter Umständen auch aus vorhergehenden Unterformularen verwendet.

#### `getFieldValueInSection(fieldName, sectionName)`

Übergibt den Inhalt des Felds mit Namen `fieldName` aus dem Bereich mit Namen `sectionName`.

#### `setFieldValueInSection(fieldName, sectionName, newValue)`

Aktualisiert den Inhalt des Felds mit Namen `fieldName` aus dem Bereich mit Namen `sectionName`.

#### `getFieldValueAtIndex(fieldName, index)`

Übergibt den Inhalt des Felds mit Namen `fieldName` auf Index `index` (nullbasiert), bezogen sowohl auf das
Hauptformular als
auch Unterformularfelder mit gleichem Namen.

#### `setFieldValueAtIndex(fieldName, index, newValue)`

Aktualisiert den Inhalt des Felds mit Namen `fieldName` auf Index `index` (nullbasiert), bezogen sowohl auf das
Hauptformular als
auch Unterformularfelder mit gleichem Namen.

#### `getFieldValues(fieldName)`

Übergibt alle Inhalte als `Array` für alle Formularfelder inklusive Unterformulare, deren Feldname `fieldName` ist.

#### `subformBlockCount(subformFieldName)`

Übergibt die Anzahl aller Blöcke für ein Unterformular mit Formularfeldnamen `subformFieldName`.

#### `getSubformFieldNames(subformName)`

Übergibt Formularfeldnamen für Unterformulare mit Namen `subformName`.

#### `getActiveButtonForm()`

Übergibt, sofern verfügbar, Informationen zum (Unter-)Formular mit aktuell aktiven Button.

In Onkostar kann derzeit nicht festgestellt werden, in welchem Unterformular(exemplar) eine Änderung erfolgte,
da der BlockIndex nicht verfügbar ist. 

Ein Button hat nach dem Betätigen/Klick den Fokus und ist aktives Element. Diese Funktion kann dazu genutzt werden,
um festzustellen, in welchem Unterformular (BlockIndex) ein Button betätigt wurde um diese Information in einem 
Formular-Script z.B. "Nach Aktualisierung" verfügbar zu machen.

Beispiele für Rückgabewerte:
* Wenn kein aktiver Button in einem Formular festgestellt wurde: `undefined`
* Aktiver Button in einem Hauptformular (JSON-Notation): `{ "isSubform": false }`
* Aktiver Button in einem Unterformular (JSON-Notation):
  ```json lines
  {
    "isSubform": true,
    "blockIndex": 1,
    "formName": "OS.Example",
    "subformFieldName": "examplesubform"
  }
  ```
