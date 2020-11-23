import React from 'react'
import { i18n } from "../../i18n";
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import head from 'lodash/head'
import Head from 'next/head'

const QuestionsShow = ({question, error}) => {
  error && console.log('QuestionsShow error', error)
  if (isEmpty(question)) return false
  const firstImage = head(question.question.images)
  return (
    <div>
      <Head>
        <title>{question.question.title}</title>
      </Head>
      <button onClick={() => i18n.changeLanguage('en')}>to en</button>
      <button onClick={() => i18n.changeLanguage('ja')}>to ja</button>
      <div>{question.question.title}</div>
      <p>{question.question.description}</p>
      {firstImage && <img src={firstImage.thumb_url} />}
    </div>
  );
};

QuestionsShow.getInitialProps = async({req, res, query, ...ctx}) => {
  const language = req ? req.i18n.language : i18n.language
  const id = query.id
  const response = await axios.get(`https://api.igaming8.com/api/web/v1/questions/${id}?locale=${language}`)
  return {
    namespacesRequired: ['common'],
    question: !response.error && response.data,
    error: response.error && response.error,
  }
}

export default QuestionsShow
