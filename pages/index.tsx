import React, { useEffect, useState } from 'react'

const Home = () => {
  const [idols, setIdols] = useState([])
  const now = new Date()

  const stringToBirthday = (s: string): string => {
    return s.slice(2).replaceAll('-', '/')
  }

  const stringToGetMonth = (s: string) => {
    return Number(stringToBirthday(s).slice(0, 2))
  }

  const stringToGetDay = (s: string) => {
    return Number(stringToBirthday(s).slice(3))
  }

  const isBirthday = (d: string): boolean => {
    return now.getMonth() + 1 === stringToGetMonth(d) && now.getDate() == stringToGetDay(d)
  }

  const birthdayText = (n: number): string => {
    if (n === 0) {
      return '誕生日おめでとうございます！🎉'
    } else {
      return `お誕生日まであと${n}秒です`
    }
  }

  const countdownNumber = (d: string): number => {
    if (isBirthday(d)) {
      return 0
    } else {
      const birthday = new Date(now.getFullYear(), stringToGetMonth(d) - 1, stringToGetDay(d));
      const endYear = birthday < now ? now.getFullYear() + 1 : now.getFullYear();
      const end = new Date(endYear, stringToGetMonth(d), stringToGetDay(d));

      const second = Math.floor((end - now) / 1000);
      return second
    }
  }

  const q = `
PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?birthDate ?name
WHERE {
  ?s rdfs:label ?name;
      rdf:type ?type;
      imas:nameKana|imas:alternateNameKana ?kana;
      schema:birthDate ?birthDate .
      FILTER (regex(str(?type), 'Idol$|Staff$'))
}
ORDER BY ?birthDate
  `

  useEffect(() => {
    const baseUrl = 'https://sparql.crssnky.xyz/spql/imas/query?format=json&query='
    const queryUrl = `${baseUrl}${encodeURIComponent(q)}`

    fetch(queryUrl).then(res => {
      return res.json()
    }).then(jsonData => {
      setIdols(
        jsonData.results.bindings.map(binding => {
          return {
            name: binding.name.value,
            birthday: stringToBirthday(binding.birthDate.value),
            seconds: countdownNumber(binding.birthDate.value)
          }
        })
      )
    }).catch(e => console.error(e))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIdols(idols.map(idol => {
        return {
          name: idol.name,
          birthday: idol.birthday,
          seconds: idol.seconds === 0 ? 0 : idol.seconds - 1,
        }
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [idols])

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-3xl m-4">アイドル誕生日カウントダウン一覧</h1>
      <table className='table-auto mx-auto mb-4'>
        <thead>
          <tr className="bg-gray-200">
            <th className='border px-4 py-2'>名前</th>
            <th className='border px-4 py-2'>誕生日</th>
            <th className='border px-4 py-2'></th>
          </tr>
        </thead>
        <tbody>
          {idols.map((idol, i) => {
            return (
              <tr key={idol.name} className={i % 2 == 1 ? 'bg-gray-200' : 'bg-white'}>
                <td className='border px-4 py-2'>{idol.name}</td>
                <td className='border px-4 py-2'>{idol.birthday}</td>
                <td className={`border px-4 py-2 ${idol.seconds === 0 ? 'bg-pink-300' : ''}`}>{birthdayText(idol.seconds)}</td>
              </tr>
            )
          })}

        </tbody>

      </table>
    </div>
  )
}

export default Home
