import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {statusCode || 'Error'}
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          {statusCode
            ? `Ein Fehler ${statusCode} ist aufgetreten`
            : 'Ein Fehler ist aufgetreten'}
        </p>
        <a 
          href="/" 
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem'
          }}
        >
          Zurück zur Startseite
        </a>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
