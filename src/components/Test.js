import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import { findUsers } from '../gql/queries'

const StyledButton = styled(Button)`
  padding: 7px 14px;
  &:hover {
    background-color: #5469d4;
  }
`

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
    }
  }

  onChange = (e, field) => {
    this.setState({
      [field]: e.target.value,
    })
  }

  createUser = () => {}

  render() {
    return (
      <>
        <div>
          <div>
            <p>add user</p>
            <input
              type="text"
              placeholder="enter your name"
              value={this.state.name}
              onChange={(e) => this.onChange(e, 'name')}
            />
          </div>

          <StyledButton onClick={this.createUser}>add user</StyledButton>
        </div>

        <Query query={findUsers}>
          {({ error, loading, data }) => {
            if (error || loading || !data) {
              return <div>nothing yet</div>
            }

            return data.users.map((user) => {
              return (
                <div>
                  <div>
                    <p>
                      id:
                      {user.id}
                    </p>
                    <p>
                      Name:
                      {user.name}
                    </p>
                  </div>
                </div>
              )
            })
          }}
        </Query>
      </>
    )
  }
}

export default Test
