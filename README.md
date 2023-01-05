# Onkostar Scriptsammlung "onkostar-ukw-jsutils"

Eine Sammlung von JavaScript-Funktionen und Klassen zur Verwendung innerhalb von Onkostar-Formular-Scripten.

Diese Sammlung kann wie ein Onkostar-Plugin installiert werden, enthält jedoch keine Pluginfunktionalität.
Es stellt vielmehr eine Sammlung von JavaScript-Dateien bereit, die innerhalb von Onkostar verwendet werden können.

## FormUtils

Die Klasse `FormUtils` stellt Hilfsfunktionen zur Verwendung in Onkostar bereit und erweitert damit bestehende Funktionalität für Formularfelder.

### Verwendung

Fügen Sie in ein Formular folgenden JavaScript-Code in die Bereiche **Beim Neuanlegen** beziehungsweise **Beim bearbeiten** ein

```javascript
Ext.require('app.lib.ukw.FormUtils');
```

Sie können nun in Scripts zu Formularfeldern `FormUtils` initialisieren und verwenden.

```javascript
// `this` ist in diesem Zusammenhang das Formular.
let formUtils = new FormUtils(this);

// Wert des Formularfelds `demo` explizit aus dem Hauptformular. Unterformulare werden ignoriert.
// Dadurch verält es sich anders als `getFieldValue()` von Onkostar, welches den ersten Treffer,
// unter Umständen auch aus vorhergehenden Unterformularen verwendet.
let value = formUtils.getMainformFieldValue('demo');
```

### Verfügbare Methoden

#### `getMainformField(fieldName)`

Übergibt das komplette Feld mit Namen `fieldName` aus dem Hauptformular und ignoriert alle,
auch vorhergehende Unterformularfelder mit gleichem Namen.

#### `getFieldAtIndex(fieldName, index)`

Übergibt das komplette Feld mit Namen `fieldName` auf Index `index` (nullbasiert), bezogen sowohl auf das Hauptformular als 
auch Unterformularfelder mit gleichem Namen.

#### `getMainformFieldValue(fieldName)`

Übergibt den Inhalt des Felds mit Namen `fieldName` aus dem Hauptformular und ignoriert alle,
auch vorhergehende Unterformularfelder mit gleichem Namen.

Dadurch unterscheidet es sich von `getFieldValue()` von Onkostar, welches den ersten Treffer, 
unter Umständen auch aus vorhergehenden Unterformularen verwendet.

#### `setMainformFieldValue(fieldName, newValue)`

Aktualisiert den Inhalt des Felds mit Namen `fieldName` aus dem Hauptformular und ignoriert alle,
auch vorhergehende Unterformularfelder mit gleichem Namen.

Dadurch unterscheidet es sich von `setFieldValue()` von Onkostar, welches den ersten Treffer,
unter Umständen auch aus vorhergehenden Unterformularen verwendet.

#### `getFieldValueAtIndex(fieldName, index)`

Übergibt den Inhalt des Felds mit Namen `fieldName` auf Index `index` (nullbasiert), bezogen sowohl auf das Hauptformular als
auch Unterformularfelder mit gleichem Namen.

#### `setFieldValueAtIndex(fieldName, index, newValue)`

Aktualisiert den Inhalt des Felds mit Namen `fieldName` auf Index `index` (nullbasiert), bezogen sowohl auf das Hauptformular als
auch Unterformularfelder mit gleichem Namen.

#### `getFieldValues(fieldName)`

Übergibt alle Inhalte als `Array` für alle Formularfelder inklusive Unterformulare, deren Feldname `fieldName` ist.

#### `subformBlockCount(subformFieldName)`

Übergibt die Anzahl aller Blöcke für ein Unterformular mit Formularfeldnamen `subformFieldName`.

#### `getSubformFieldNames(subformName)`

Übergibt Formularfeldnamen für Unterformulare mit Namen `subformName`.
