class FormUtils {

    constructor(context) {
        this.context = context;

        if (!this.context.genericEditForm) {
            console.warn('Context does not contain "genericEditForm".\nThis should only occur in form development mode.');
        }
    }

    /**
     * Returns field with given name from main form if it exists
     * @param fieldName
     * @returns {undefined|*}
     */
    getMainformField(fieldName) {
        if (this.context.genericEditForm) {
            const query = '[originalName=' + fieldName + ']';
            const fields = this.context.genericEditForm
                .query(query)
                .filter(e => e.ownerCt.xtype === 'form' || e.ownerCt.xtype === 'panel' && e.ownerCt.title.length !== 0);

            if (fields.length > 0) {
                return this.context.genericEditForm.down('#' + fields[0].id);
            }
            console.error('Field with name "' + fieldName + '" not found in main form!');
        }
        return undefined;
    }

    /**
     * Returns field with given field name found at given index within whole form.
     * @param fieldName
     * @param index
     * @returns {undefined|*}
     */
    getFieldAtIndex(fieldName, index) {
        if (this.context.genericEditForm) {
            const query = '[originalName=' + fieldName + ']';
            const fields = this.context.genericEditForm.query(query);
            if (fields.length > index) {
                return this.context.genericEditForm.down('#' + fields[index].id);
            }
            console.error('Field with name "' + fieldName + '" and index "' + index + '" not found!');
        }
        return undefined;
    }

    /**
     * Returns field with given field name found in section with given name.
     * @param fieldName
     * @param sectionName
     * @returns {undefined|*}
     */
    getFieldInSection(fieldName, sectionName) {
        if (this.genericEditForm) {
            const query = '[originalName=' + fieldName + ']';
            const fields = this.context.genericEditForm
                .query(query)
                .filter(e => e.ownerCt.xtype === 'panel' && e.ownerCt.ownerCt.originalName === sectionName);
            if (fields.length > 0) {
                return this.context.genericEditForm.down('#' + fields[0].id);
            }
            console.error('Field with name "' + fieldName + '" not found in section with name "' + sectionName + '"!');
        }
        return undefined;
    }

    /**
     * Returns value of field with given name from main form if it exists.
     * @param fieldName
     * @returns {undefined|*}
     */
    getMainformFieldValue(fieldName) {
        let mainformField = this.getMainformField(fieldName);
        if (mainformField) {
            return mainformField.getValue();
        }
        return undefined;
    }

    /**
     * Updates field with given name to given new value.
     * The field must reside in main form.
     * @param fieldName
     * @param newValue
     * @returns {undefined|*}
     */
    setMainformFieldValue(fieldName, newValue) {
        let mainformField = this.getMainformField(fieldName);
        if (mainformField) {
            return mainformField.setValue(newValue);
        }
    }

    /**
     * Returns value of field with given name in section with given name if it exists.
     * @param fieldName
     * @param sectionName
     * @returns {undefined|*}
     */
    getFieldValueInSection(fieldName, sectionName) {
        let sectionField = this.getFieldInSection(fieldName, sectionName);
        if (sectionField) {
            return sectionField.getValue();
        }
        return undefined;
    }

    /**
     * Updates field with given name in section with given name new value.
     * The field must reside in main form.
     * @param fieldName
     * @param sectionName
     * @param newValue
     * @returns {undefined|*}
     */
    setFieldValueInSection(fieldName, sectionName, newValue) {
        let sectionField = this.getFieldInSection(fieldName, sectionName);
        if (sectionField) {
            return sectionField.setValue(newValue);
        }
    }

    /**
     * Returns value of field with given field name found at given index within whole form.
     * @param fieldName
     * @param index
     * @returns {undefined|*}
     */
    getFieldValueAtIndex(fieldName, index) {
        let field = this.getFieldAtIndex(fieldName, index);
        if (field) {
            return field.getValue();
        }
        return undefined;
    }

    /**
     * Updates value of field with given field name found at given index within whole form.
     * @param fieldName
     * @param index
     * @param newValue
     * @returns {undefined|*}
     */
    setFieldValueAtIndex(fieldName, index, newValue) {
        let field = this.getFieldAtIndex(fieldName, index);
        if (field) {
            field.setValue(newValue);
        }
    }

    /**
     * Returns all values for all fields with given name.
     * @param fieldName
     * @returns {*|*[]}
     */
    getFieldValues(fieldName) {
        if (this.context.genericEditForm) {
            const query = '[originalName=' + fieldName + ']';
            const fields = this.context.genericEditForm.query(query);
            return fields.map(f => this.context.genericEditForm.down('#' + f.id).getValue());
        }
        return undefined;
    }

    /**
     * Counts blocks within given subform field name.
     * @param subformFieldName
     * @returns {undefined|*|number}
     */
    subformBlockCount(subformFieldName) {
        if (this.context.genericEditForm) {
            const query = '[originalName=' + subformFieldName + ']';
            const elements = this.context.genericEditForm.query(query);

            if (elements.length === 0) return 0;

            return elements
                .map(e => e.numberOfBlocks)
                .reduce((sum, num) => sum + num);
        }
        return undefined;
    }

    /**
     * Returns subform field names for given subform name.
     * @param subformName
     * @returns {undefined|*}
     */
    getSubformFieldNames(subformName) {
        if (this.context.genericEditForm) {
            const query = '[formName=' + subformName + ']';

            return Ext.ComponentQuery
                .query(query)
                .map(e => e.originalName);
        }
        return undefined;
    }

    /**
     * Returns information about button field containing current active HTML button element.
     *
     * If current active button is within main form, `isSubform` will be `false`;
     * if in subform, `isSubform` will be `true` and result will contain additional information
     * about subform and block index.
     *
     * If no active element in form or subform `undefined`, this method will return `undefined`.S
     *
     * Example response as JSON:
     *
     * ```
     * {
     *     "isSubform": true,
     *     "blockIndex": 1,
     *     "formName": "OS.Example",
     *     "subformFieldName": "examplesubform"
     * }
     * ```
     *
     * @returns {undefined|*|{isSubform: boolean, blockIndex: *, formName: *, subformFieldName: *}|{isSubform: boolean}}
     */
    getActiveButtonForm() {
        const findElemId = (elem) => {
            if (elem.tagName === 'BODY') {
                return undefined;
            }

            if (elem.tagName === 'TABLE') {
                return elem.id;
            }

            return findElemId(elem.parentElement);
        }

        const formInfo = (formItem, blockIndex = undefined) => {
            if (formItem.xtype === 'buttonField') {
                return formInfo(formItem.ownerCt, formItem.blockIndex);
            }

            if (formItem.xtype === 'panel' || formItem.xtype === 'sectionField') {
                return formInfo(formItem.ownerCt, blockIndex);
            }

            if (formItem.xtype === 'subformField') {
                return {
                    isSubform: true,
                    formName: formItem.formName,
                    subformFieldName: formItem.subformName,
                    blockIndex: blockIndex
                };
            }

            if (formItem.xtype === 'form') {
                return {
                    isSubform: false,
                };
            }

            console.warn('No information found!');
            return undefined;
        }

        if (this.context.genericEditForm && document.activeElement.tagName === 'BUTTON') {
            let elemId = findElemId(document.activeElement);
            if (elemId) {
                let formItem = this.context.genericEditForm.down('#'+elemId);
                if (formItem) {
                    return formInfo(formItem);
                }
            }
        }

        return undefined;
    }
}

/**
 * Wrapper for use with ExtJS
 *
 * Usage example:
 *
 * let formUtils = Ext.ClassManager.get('cccmf.FormUtils').new(this);
 * console.log(formUtils.getMainformFieldValue('Start'));
 */
Ext.define('cccmf.FormUtils', {
    statics: {
        new: (context) => new FormUtils(context)
    }
});