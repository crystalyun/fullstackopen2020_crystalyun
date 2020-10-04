import React from 'react';


export const Books = ({books, onBookSelect}) => {
  return (
    <div className="books-wrapper">
      { books.map( ({ volumeInfo, id }) => (
        <div className="book" key={id} onClick={() => onBookSelect(id)}>
          <img alt={volumeInfo.title}/>
          <span><strong>{volumeInfo.title}</strong></span>
          <p>{volumeInfo.authors[0]}</p>
        </div>
      ))}
    </div>
  )
}
