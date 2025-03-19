import React from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export function ZnTextEditor({value}) {
    return (
        <div>
            <Editor
                value={value}
                toolbarClassName="demo-toolbar-custom"
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor-custom"
                mention={{
                    separator: ' ',
                    trigger: '@',
                    suggestions: [
                        { text: 'APPLE', value: 'apple', url: 'apple' },
                        { text: 'BANANA', value: 'banana', url: 'banana' },
                        { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                        { text: 'DURIAN', value: 'durian', url: 'durian' },
                        { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                        { text: 'FIG', value: 'fig', url: 'fig' },
                        { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                        { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
                    ],
                }}
                hashtag={{}}
                toolbar={{
                    blockType: { className: 'demo-option-custom-wide ', dropdownClassName: 'demo-dropdown-custom' },
                    inline: {
                        bold: {
                            // icon: <AlignCenter/>,
                            className: 'demo-option-custom'
                        },
                        italic: { className: 'demo-option-custom' },
                        underline: { className: 'demo-option-custom' },
                        strikethrough: { className: 'demo-option-custom d-none' },
                        monospace: { className: 'demo-option-custom d-none' },
                        superscript: { className: 'demo-option-custom d-none' },
                        subscript: { className: 'demo-option-custom d-none' },
                    },

                    fontSize: { className: 'demo-option-custom-medium' },
                    list: {
                        unordered: { className: 'demo-option-custom' },
                        ordered: { className: 'demo-option-custom' },
                        indent: { className: 'demo-option-custom' },
                        outdent: { className: 'demo-option-custom' },
                    },
                    textAlign: {
                        left: { className: 'demo-option-custom' },
                        center: { className: 'demo-option-custom' },
                        right: { className: 'demo-option-custom' },
                        justify: { className: 'demo-option-custom' },
                    },
                    fontFamily: { className: 'demo-option-custom-wide d-none', dropdownClassName: 'demo-dropdown-custom' },
                    colorPicker: { className: 'demo-option-custom d-none', popupClassName: 'demo-popup-custom' },
                    link: {
                        className: 'd-none',
                        popupClassName: 'demo-popup-custom',
                        link: { className: 'demo-option-custom' },
                        unlink: { className: 'demo-option-custom' },
                    },
                    emoji: { className: 'demo-option-custom d-none', popupClassName: 'demo-popup-custom' },
                    embedded: { className: 'demo-option-custom  d-none', popupClassName: 'demo-popup-custom' },
                    image: { className: 'demo-option-custom  d-none', popupClassName: 'demo-popup-custom' },
                    remove: { className: 'demo-option-custom  d-none' },
                    history: {
                        undo: { className: 'demo-option-custom  d-none' },
                        redo: { className: 'demo-option-custom  d-none' },
                    },
                }}
            />
        </div>
    );
}

