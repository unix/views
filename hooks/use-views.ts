import { useEffect, useState } from 'react'
const origin = 'https://views.unix.bio/json'

const getViews = async (key: string, readOnly: boolean, unique: boolean) => {
  let url = `${origin}?key=${key}`
  if (readOnly) {
    url += '&readonly=1'
  }
  if (unique) {
    url += '&unique=1'
  }
  try {
    const response = await fetch(url, {
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
    })
    if (!response.ok) return { count: 0 }
    return response.json()
  } catch (e) {
    return { count: 0 }
  }
}

export type ViewsOptions = {
  readOnly?: boolean
  unique?: boolean
  disabled?: boolean
}

const useViews = (key: string, options: ViewsOptions = {}) => {
  const [count, setCount] = useState<number>(0)
  const [updated, setUpdated] = useState<boolean>(false)
  const { readOnly = false, unique = false, disabled = false } = options

  useEffect(() => {
    let unmount = false
    if (disabled) return
    ;(async () => {
      const res = await getViews(key, readOnly, unique)
      if (unmount) return
      setCount(res.count)
      setUpdated(true)
    })()
    return () => {
      unmount = true
    }
  }, [disabled])

  return [count, updated]
}

export default useViews
