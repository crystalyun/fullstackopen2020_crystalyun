import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'

const TimeAgo = ({ ISOtimestampStr }) => {
    let timeAgo = ''
    if (ISOtimestampStr) {
        const date = parseISO(ISOtimestampStr)
        const timePeriod = formatDistanceToNow(date)
        timeAgo = `${timePeriod} ago`
    }

    return (
        <span title={ISOtimestampStr}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )

}

export default TimeAgo