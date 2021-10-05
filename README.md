<h1 align="center">:zap: react-github-data</h1></br>
<p align="center">
  <img src="./art/cover.svg" width="350px"><!-- YS0 -->
  <br><br>
  A collection of React components to easily display basic information about a GitHub user, repository, etc.<br><br>
  This can, for example, be used to display the number of stars on a repository on your portfolio website. <br>See <a href="https://joery.nl">Joery.nl</a> for an example of this.
</p>

<h6 align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" height="24" valign="middle">&nbsp;&nbsp;
  <img src= "https://joery.nl/static/vector/logo.svg" height="24" valign="middle">&nbsp;&nbsp;By <a href="https://joery.nl">Joery Droppers</a>
</h6>

## Features

This library is not a widget; you can use the components to display a single piece of data and integrate it into your webpage as desired

- Easy to use
- Data is fetched once for multiple components
- Fetched data is cached
- Easy to style and customize with CSS

## Example

```jsx
import { GitHubRepo } from "react-github-data";
```

<b>Display stars</b>

```jsx
<GitHubRepo user="Droppers" repo="AnimatedBottomBar" data="stars" />
```

<b>Display custom content</b>

```jsx
<GitHubRepo
  user="Droppers"
  repo="AnimatedBottomBar"
  content={(data) => (
    <>
      The <b>{data.name}</b> repo has <b>{data.stars}</b> stars and
      <b>{data.forks}</b>forks!
    </>
  )}
/>
```

## Available components

### GitHubRepo

To display information about a repository use the `GitHubRepo` component.

```jsx
import { GitHubRepo } from 'react-github-data';
...
<GitHubRepo
  user="Droppers"
  repo="AnimatedBottomBar"
  data="stars" />
```

#### Props

<table>
  <tr>
    <th>Property</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>user</td>
    <td>The owners name (user or organization) of the repository.</td>
  </tr>
  <tr>
    <td>repo</td>
    <td>A repository name owned by the user set in the <b>user</b> prop.</td>
  </tr>
  <tr>
    <td>data</td>
    <td>The data about the repository to display, the following values are possible: 
      <ul>
        <li>description</li>
        <li>language</li>
        <li>stars</li>
        <li>watchers</li>
        <li>forks</li>
      </ul></td>
  </tr>
</table>

<hr>

### GitHubUser

```jsx
import { GitHubUser } from 'react-github-data';
...
<GitHubUser
  user="Droppers"
  data="followers" />
```

#### Props

<table>
  <tr>
    <th>Property</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>user</td>
    <td>The name of the user you want to display information of.</td>
  </tr>
  <tr>
    <td>data</td>
    <td>The data about the user to display, following values are possible: 
      <ul>
        <li>followers</li>
        <li>following</li>
      </ul>
    </td>
  </tr>
</table>

## Customization

### Custom content

As shown in the example in the beginning, it is also possible to use one component to display all information desired. For this the `content` prop can be used, this props expects a function with the fetched data as argument.

### Load and error callbacks

If you want to do something in case an error occurs while fetching the data or the data is successfully loaded, you can use one of the following callback props:

- onDataLoad
- onDataError (<i>Note: does not include the error message due to the design of the library</i>)

### Loading and error content

By default, the content of the component will be empty when loading or when an error occurs. To change the default content for these situations, you can use the props demonstrated in the example below.

```jsx
import { GitHubUser } from 'react-github-data';
...
<GitHubRepo
  loading={<div>Loading information. (JSX)</div>}
  error="Could not load information. (text)" />
```

### Styling

There are also several standard styleable classes that you can use, and you can use your own using the `className` prop. The inner HTML element of this component is a `div` element.

<table>
  <tr>
    <th>classname</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>gh-data</td>
    <td>All components have this class by default.</td>
  </tr>
  <tr>
    <td>gh-<i>[user|repo]</i></td>
    <td>Postfix of this class depends on the component you use. This class is always present.</td>
  </tr>
  <tr>
    <td>gh-loading</i></td>
    <td>This class will be present when the component is fetching information from GitHub.</td>
  </tr>
  <tr>
    <td>gh-loaded</i></td>
    <td>This class will be present when the component succesfully fetched the information from GitHub.</td>
  </tr>
  <tr>
    <td>gh-error</i></td>
    <td>This class will be present when the component failed to load information from GitHub.</td>
  </tr>
</table>

## Example

<img src="./art/example.svg" width="300px">

Below is an example of JSX and CSS on how to recreate the widget shown above.

<b>JSX</b>
There are two methods you can use, you can use multiple components, as demonstrated in the first example, or use the `content` prop to use one component to display more information, as demonstrated in the second example.

```jsx
import React from "react";
import { GitHubRepo } from "react-github-data";

export default function App() {
  const user = "Droppers";
  const repo = "AnimatedBottomBar";

  return (
    <>
      <h1>Example one</h1>
      <div className="github-card">
        <div className="name">AnimatedBottomBar</div>
        <div className="description">
          <GitHubRepo user={user} repo={repo} data="description" />
        </div>
        <div className="info">
          <GitHubRepo user={user} repo={repo} data="language" />
          <img alt="Stars" src="https://svgshare.com/i/YQV.svg" />
          <GitHubRepo user={user} repo={repo} data="stars" />
          <img alt="Forks" src="https://svgshare.com/i/YNP.svg" />
          <GitHubRepo user={user} repo={repo} data="forks" />
        </div>
      </div>

      <h1>Example two</h1>
      <GitHubRepo
        className="github-card"
        user={user}
        repo={repo}
        content={(data) => (
          <>
            <div className="name">{data.name}</div>
            <div className="description">{data.description}</div>
            <div className="info">
              {data.language}
              <img alt="Stars" src="https://svgshare.com/i/YQV.svg" />
              {data.stars}
              <img alt="Forks" src="https://svgshare.com/i/YNP.svg" />
              {data.forks}
            </div>
          </>
        )}
      />
    </>
  );
}
```

<b>CSS</b>

```css
.github-card {
  width: 400px;
  padding: 15px;
  background-color: white;
  border: 1px solid #bbb;
  border-radius: 10px;
  font: 14px Arial;
}

.github-card .name {
  color: #0b69ff;
  font-weight: bold;
}

.github-card .description {
  margin: 10px 0;
}

.github-card .info div {
  margin-right: 10px;
}
.github-card .info img {
  margin-right: 5px;
  vertical-align: text-bottom;
}
```

## License

```
MIT License

Copyright (c) 2021 Joery Droppers (https://github.com/Droppers)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
