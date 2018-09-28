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

// @flow
import React, { Component } from 'react'
import { JssProvider } from 'react-jss'
import {
  MuiThemeProvider,
  createGenerateClassName,
  createMuiTheme
} from '@material-ui/core/styles'
import darkTheme from './DarkTheme'
export { darkTheme }

const generateClassName = createGenerateClassName({ productionPrefix: 'ory' })
export const themeOptions = {}
const theme = createMuiTheme(themeOptions)

class ThemeProvider extends Component {
  render() {
    // return <React.Fragment>{this.props.children}</React.Fragment>
    // return (
    //   <JssProvider generateClassName={generateClassName}>
    //     <MuiThemeProvider theme={this.props.theme || theme}>
    //       {this.props.children}
    //     </MuiThemeProvider>
    //   </JssProvider>
    // )
    return (
      // <JssProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={this.props.theme || theme}>
          {this.props.children}
        </MuiThemeProvider>
      // </JssProvider>
    )
  }
}

export default ThemeProvider
