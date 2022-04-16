import styled from 'styled-components'

const Container = styled.div`
  margin-left: 24px;
  margin-right: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 24px;
    margin-right: 24px;
  }
`

export default Container
