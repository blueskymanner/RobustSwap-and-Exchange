import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Text, Checkbox, CogIcon, IconButton } from '@robustswap-libs/uikit'
import styled from 'styled-components'
import { TranslateString } from 'utils/translateTextHelpers'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import { AppDispatch, AppState } from '../../state'
import { acceptListUpdate, removeList, selectList } from '../../state/lists/actions'
import { useSelectedListUrl } from '../../state/lists/hooks'
import { CloseIcon, ExternalLink, LinkStyledButton, TYPE } from '../Shared'
import listVersionLabel from '../../utils/listVersionLabel'
import { parseENSAddress } from '../../utils/parseENSAddress'
import uriToHttp from '../../utils/uriToHttp'
import Column from '../Column'
import ListLogo from '../ListLogo'
import Row, { RowBetween } from '../Row'
import { PaddedColumn, SearchInput } from './styleds'

const { error: Error } = TYPE

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  color: #FF7070;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: #1E215C;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => 'white'};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`

const StyledListUrlText = styled.div`
  max-width: 180px;
  opacity: 0.6;
  margin-right: 0.5rem;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`

function ListOrigin({ listUrl }: { listUrl: string }) {
  const ensName = useMemo(() => parseENSAddress(listUrl)?.ensName, [listUrl])
  const host = useMemo(() => {
    if (ensName) return undefined
    const lowerListUrl = listUrl.toLowerCase()
    if (lowerListUrl.startsWith('ipfs://') || lowerListUrl.startsWith('ipns://')) {
      return listUrl
    }
    try {
      const url = new URL(listUrl)
      return url.host
    } catch (error) {
      return undefined
    }
  }, [listUrl, ensName])
  return <>{ensName ?? host}</>
}

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl, onBack }: { listUrl: string; onBack: () => void }) {
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
  const selectedListUrl = useSelectedListUrl()
  const dispatch = useDispatch<AppDispatch>()
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const isSelected = selectedListUrl.includes(listUrl)

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
  })

  useOnClickOutside(node, open ? toggle : undefined)

  const selectThisList = useCallback(() => {
    dispatch(selectList(listUrl))
    // onBack()
  }, [dispatch, listUrl])

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return
    dispatch(acceptListUpdate(listUrl))
  }, [dispatch, listUrl, pending])

  const handleRemoveList = useCallback(() => {
    if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  if (!list) return null

  return (
    <Row key={listUrl} align="center" padding="16px" id={listUrlRowHTMLId(listUrl)}>
      {list.logoURI ? (
        <ListLogo style={{ marginRight: '1rem' }} logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <Text bold={isSelected} fontSize="16px" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {list.name}
          </Text>
        </Row>
        <Row
          style={{
            marginTop: '4px',
          }}
        >
          <StyledListUrlText title={listUrl} style={{ color: 'white', opacity: 1 }}>
            <ListOrigin listUrl={listUrl} />
          </StyledListUrlText>
        </Row>
      </Column>
      <StyledMenu ref={node as any}>
        <div style={{ display: 'inline-block' }} ref={setReferenceElement}>
          <IconButton variant="text" onClick={toggle}>
            <CogIcon />
          </IconButton>
          {/* <Button
          style={{
          width: '32px',
          marginRight: '8px',
        }}
          onClick={toggle}
          variant="secondary"
          >
          
          </Button> */}
        </div>

        {open && (
          <PopoverContainer show ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
            <div>{list && listVersionLabel(list.version)}</div>
            <ExternalLink href={`https://bsctokenlists.org/token-list?url=${listUrl}`}>See</ExternalLink>
            <UnpaddedLinkStyledButton onClick={handleRemoveList} disabled={Object.keys(listsByUrl).length === 1}>
              Remove
            </UnpaddedLinkStyledButton>
            {pending && (
              <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>Update list</UnpaddedLinkStyledButton>
            )}
          </PopoverContainer>
        )}
      </StyledMenu>
      {/* {isSelected ? (
        <Checkbox readOnly checked />
      ) : ( */}
        <>
          <Button
            className="select-button"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0
            }}
            onClick={selectThisList}
          >
            <Checkbox readOnly checked={isSelected} />
          </Button>
        </>
      {/* )} */}
    </Row>
  )
})

const ListContainer = styled.div`
  flex: 1;
  overflow: auto;
`

export function ListSelect({ onDismiss, onBack }: { onDismiss: () => void; onBack: () => void }) {
  const [listUrlInput, setListUrlInput] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
  const adding = Boolean(lists[listUrlInput]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value)
    setAddError(null)
  }, [])
  const fetchList = useFetchListCallback()

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listUrlInput)
      .then(() => {
        setListUrlInput('')
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listUrlInput))
      })
  }, [adding, dispatch, fetchList, listUrlInput])

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
  }, [listUrlInput])

  const handleEnterKey = useCallback(
    (e) => {
      if (validUrl && e.key === 'Enter') {
        handleAddList()
      }
    },
    [handleAddList, validUrl]
  )

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        return Boolean(lists[listUrl].current)
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]
        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
              ? 0
              : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists])

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn>
        <RowBetween>
          <div style={{ display: 'flex' }}>
            <ArrowLeft style={{ cursor: 'pointer', color: '#A0B9FB', marginTop: 'auto', marginBottom: 'auto' }} onClick={onBack} />
            <Text fontSize="20px" style={{ fontWeight: 800, lineHeight: '24px', marginLeft: 8, marginTop: 'auto', marginBottom: 'auto' }}>
              {TranslateString(304, 'Manage')}
            </Text>
          </div>
          <CloseIcon onClick={onDismiss} color='white' />
        </RowBetween>
      </PaddedColumn>

      <PaddedColumn gap="14px">
        <Row>
          <SearchInput
            type="text"
            id="list-add-input"
            placeholder="https:// or ipfs:// or ENS name"
            value={listUrlInput}
            onChange={handleInput}
            onKeyDown={handleEnterKey}
            style={{ height: '2.75rem', borderRadius: 12, padding: '12px' }}
          />
          <Button onClick={handleAddList} style={{ fontSize: 20, padding: '0px 10px', borderRadius: '50%', maxWidth: '4em', marginLeft: '8px', height: 36 }} disabled={!validUrl}>+</Button>
        </Row>
        {addError ? (
          <Error title={addError} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} error>
            {addError}
          </Error>
        ) : null}
      </PaddedColumn>

      <ListContainer>
        {sortedLists.map((listUrl) => (
          <ListRow key={listUrl} listUrl={listUrl} onBack={onBack} />
        ))}
      </ListContainer>
    </Column>
  )
}

export default ListSelect
