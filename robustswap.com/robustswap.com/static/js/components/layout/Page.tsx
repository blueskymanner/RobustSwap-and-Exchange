import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
  padding-top: 16px;
  padding-bottom: 16px;
  margin:0px;
  margin-bottom:0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 0px;
    padding-bottom: 32px;
  }
`

export default Page
