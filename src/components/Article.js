
import React from 'react';

export default function Article(props) {
  return (
    <li>
      <a href={props.data.url}>{props.data.title}</a>
    </li>
  );
};