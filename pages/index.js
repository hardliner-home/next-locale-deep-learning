import React, { useState, useEffect } from 'react'
import { withTranslation, Router, i18n } from '../i18n'
import axios from 'axios'
import map from 'lodash/map'
import head from 'lodash/head'
import concat from 'lodash/concat'
import Head from 'next/head'

function Index({response, error, t}) {
  error && console.log('error', error)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    setQuestions(concat(questions, response.questions))
  }, [response]);

  return (
    <div>
      <Head>
        <title>Locale-SSR</title>
      </Head>
      <div>Current lang translation: {t('language')}</div>
      {questions && map(questions, (question, key) => (
        <div key={key}>
          <div>{question.title}</div>
          {head(question.images) && <img src={head(question.images).thumb_url} />}
          <button onClick={() => Router.push({pathname: `/questions/${question.slug}`})}>to question</button>
        </div>
      ))}

      <button onClick={() => i18n.changeLanguage('en')}>to en</button>
      <button onClick={() => i18n.changeLanguage('ja')}>to ja</button>
      <button onClick={
        () => Router.push({
          pathname: '/',
          query: {
            order: Router.query.order,
            page: parseInt(Router.query.page) + 1 || 2
          }
        })}
      >+1</button>
      <button onClick={() => Router.push({pathname: '/', query: {order: 'most_voted', page: Router.query.page}})}>most
        voted
      </button>
      <button onClick={() => Router.push({pathname: '/', query: {order: 'most_visited', page: Router.query.page}})}>most
        visited
      </button>
    </div>
  )
}

Index.getInitialProps = async({req, res, query, ...ctx}) => {
  const language = req ? req.i18n.language : i18n.language
  const response = await axios.get(`https://api.igaming8.com/api/web/v1/questions?page=${query.page || 1}&per=5&order=${query.order || ''}&locale=${language}`)
  return {
    namespacesRequired: ['common'],
    response: !response.error && response.data,
    error: response.error && response.error,
  }
}

export default withTranslation('common')(Index)
