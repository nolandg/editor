/*
 * This file is part of ORY Editor.
 *
 * ORY Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ORY Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with ORY Editor.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license LGPL-3.0
 * @copyright 2016-2018 Aeneas Rekkas
 * @author Aeneas Rekkas <aeneas+oss@aeneas.io>
 *
 */

/* eslint-disable no-alert, prefer-reflect, no-underscore-dangle */
import { createMuiTheme } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { Portal } from 'react-portal'
import position from 'selection-position'
import { Editor } from '@gitbook/slate-react'
import { BottomToolbar, ThemeProvider } from 'ory-editor-ui'
import { placeholder } from '../const'
import { withStyles } from '@material-ui/core/styles'

import { html as serializer } from '../hooks.js'

const onBlur = (_event, _data, state) => state

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
  typography: {
    useNextVariants: true
  }
})

const styles = theme => ({
  toolbar: {
    position: 'absolute',
    zIndex: 1,
    top: -10000,
    left: -10000,
    marginTop: -6,
    opacity: 0,
    backgroundColor: 'rgba(0,0,0,.8)',
    borderRadius: 4,
    transition: 'opacity .75s'
  },
  toolbarHidden: {
    opacity: '0 !important',
    pointerEvents: 'none'
  }
})

class Slate extends Component {
  componentDidMount = () => {
    this.selection = window.getSelection()
    this.updateToolbar()
  }

  shouldComponentUpdate = nextProps =>
    nextProps.state.editorState !== this.props.state.editorState ||
    nextProps.state.toolbar !== this.props.state.toolbar ||
    nextProps.focused !== this.props.focused ||
    nextProps.readOnly !== this.props.readOnly

  componentDidUpdate = () => this.updateToolbar()

  onStateChange = ({ value }) => {
    this.props.onChange({ editorState: value })
  }

  handleOpen = portal => {
    // this.toolbar = portal.firstChild
  }

  updateToolbar = () => {
    const { editorState } = this.props.state
    const toolbar = this.toolbar

    if (
      !toolbar ||
      editorState.isBlurred ||
      editorState.selection.isCollapsed
    ) {
      return
    }
    const pos = position()
    if (pos) {
      const { left, top, width } = position()

      toolbar.style.opacity = 1
      toolbar.style.top = `${top + window.scrollY - toolbar.offsetHeight}px`
      toolbar.style.left = `${left +
        window.scrollX -
        toolbar.offsetWidth / 2 +
        width / 2}px`
    }
  }

  onPaste = (e, data, state) => {
    if (data.type !== 'html') return
    if (data.isShift) return

    const { document } = serializer.deserialize(data.html)

    return state.change().insertFragment(document)
  }

  render() {
    const {
      focused,
      readOnly,
      state: { editorState },
      plugins,
      onKeyDown,
      HoverButtons,
      ToolbarButtons,
      focus,
      classes
    } = this.props
    const isOpened = editorState.selection.isExpanded && editorState.isFocused

    return (
      <div>
        <Portal onOpen={this.handleOpen}>
          {/* ory-prevent-blur is required to prevent global blurring */}
          <ThemeProvider theme={theme}>
            <div
              className={
                'ory-prevent-blur ' +
                classes.toolbar +
                (isOpened ? '' : ' ' + classes.toolbarHidden)
              }
              style={{ padding: 0 }}
              ref={toolbar => {
                this.toolbar = toolbar
                toolbar && this.updateToolbar()
              }}
            >
              <HoverButtons
                editorState={editorState}
                onChange={this.onStateChange}
                focus={focus}
              />
            </div>
          </ThemeProvider>
        </Portal>
        <Editor
          onChange={this.onStateChange}
          onKeyDown={onKeyDown}
          readOnly={Boolean(readOnly)}
          className="ory-plugins-content-slate-container"
          onBlur={onBlur}
          value={editorState}
          plugins={plugins}
          onPaste={this.onPaste}
          placeholder={placeholder}
        />
        {readOnly ? null : (
          <BottomToolbar open={focused}>
            <ToolbarButtons
              editorState={editorState}
              onChange={this.onStateChange}
              focus={focus}
            />
          </BottomToolbar>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Slate)
