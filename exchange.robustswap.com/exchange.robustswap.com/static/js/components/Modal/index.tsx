import React from 'react'
import styled, { css } from 'styled-components'
import { useMedia } from 'react-use'
import { animated, useTransition } from 'react-spring'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { transparentize } from 'polished'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 999;
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: rgba(95, 71, 238, 0.2);
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, marginLeft, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog',
})`
  &[data-reach-dialog-content] {
    margin: auto 0 auto 0;
    // border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
    // background-color: ${({ theme }) => theme.colors.invertedContrast};
    // box-shadow: 0 4px 8px 0 ${transparentize(0.95, '#191326')};
    background: ${({ theme }) => theme.modal.background};
    box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    padding: 0px;
    width: 95%;
    overflow: hidden;
    max-width: 420px;

    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    margin-left: ${({ marginLeft }) => `${marginLeft}px`};

    ${({ maxHeight }) =>
    maxHeight &&
    css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
    minHeight &&
    css`
        min-height: ${minHeight}px;
      `}
    display: flex;
    border-radius: 20px;

    ${({ theme }) => theme.mediaQueries.lg} {
      width: 65vw;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 85vw;
    }
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  height?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 50,
  height,
  initialFocusRef,
  children,
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  const isMobile = useMedia('(max-width: 970px)')
  const panel = document.getElementsByClassName("LeftSideBar")[0]
  const marginLeft = isMobile ? 0 : panel?.clientWidth;

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay key={key} style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
                marginLeft={marginLeft}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {/* eslint-disable */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {/* eslint-enable */}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
