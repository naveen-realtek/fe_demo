import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import { getWhitelistFromServer, getValue } from '../mockServer'
import Tags from '@yaireo/tagify/dist/react.tagify';

const baseTagifySettings = {
  placeholder: "type something",
  dropdown: {
    enabled: 0 
  }
}

export const CrazyTags = () => {
    const tagifyRef1 = useRef()
    const [tagifySettings, setTagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState({})
  
    // on component mount
    useEffect(() => {
      setTagifyProps({loading: true})
  
      getWhitelistFromServer().then((response) => {
        console.log("Test by sarath3");
        setTagifyProps((lastProps) => ({
          ...lastProps,
          whitelist: response,
          showFilteredDropdown: "a",
          loading: false
        }))
      })
      getValue().then((response) =>
        setTagifyProps((lastProps) => ({...lastProps, defaultValue: response}))
      )
      setTimeout(
        () =>
          setTagifyProps((lastProps) => ({
            ...lastProps,
            defaultValue: ["abc"],
            showFilteredDropdown: false
          })),
        1000
      )
    }, [])
  
    const settings = {
      ...baseTagifySettings,
      ...tagifySettings
    }
  
    const onChange = useCallback(e => {
      console.log("CHANGED:", e.detail.value)
    }, [])

    return (
      <>
        <h2>
          <em>Crazy</em> Tags:
        </h2>
        <p>
          Wait a <em>few seconds</em> to see things happen. <br />
          <small>
            <em>(Carefully examine the source-code)</em>
          </small>
        </p>
        <Tags
          tagifyRef={tagifyRef1}
          settings={settings}
          defaultValue="a,b,c"
          autoFocus={true}
          {...tagifyProps}
          onChange={onChange}
        />
      </>
    )
  }