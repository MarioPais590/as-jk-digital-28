import React from 'react';

function App() {
  return React.createElement('div', {
    className: 'min-h-screen bg-white p-8',
    style: {
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'max-w-4xl mx-auto'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-3xl font-bold text-gray-900 mb-4'
      }, 'Sistema Financeiro - Migração de Dados'),
      
      React.createElement('div', {
        key: 'migration-info',
        className: 'bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'
      }, [
        React.createElement('h2', {
          key: 'subtitle',
          className: 'text-xl font-semibold text-blue-900 mb-3'
        }, 'Acesso à Ferramenta de Migração'),
        
        React.createElement('p', {
          key: 'description',
          className: 'text-blue-800 mb-4'
        }, 'Devido a problemas técnicos no projeto atual, você pode acessar a ferramenta de migração através do link direto abaixo:'),
        
        React.createElement('a', {
          key: 'migration-link',
          href: '/migracao',
          className: 'inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors',
          style: { textDecoration: 'none' }
        }, '🔗 Acessar Migração de Dados'),
        
        React.createElement('div', {
          key: 'instructions',
          className: 'mt-4 text-sm text-blue-700'
        }, [
          React.createElement('p', {
            key: 'step1',
            className: 'mb-2'
          }, '1. Clique no link acima para acessar a ferramenta'),
          React.createElement('p', {
            key: 'step2',
            className: 'mb-2'
          }, '2. Faça login com suas credenciais'),
          React.createElement('p', {
            key: 'step3'
          }, '3. Use a ferramenta para exportar todos os seus dados')
        ])
      ]),
      
      React.createElement('div', {
        key: 'problem-info',
        className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-6'
      }, [
        React.createElement('h3', {
          key: 'problem-title',
          className: 'text-lg font-semibold text-yellow-900 mb-2'
        }, 'Sobre o Problema Técnico'),
        
        React.createElement('p', {
          key: 'problem-desc',
          className: 'text-yellow-800 mb-3'
        }, 'O projeto atual está com corrupção no sistema de build (bundling do React/Vite). Isso causa erros persistentes que não podem ser corrigidos apenas alterando código.'),
        
        React.createElement('p', {
          key: 'solution-desc',
          className: 'text-yellow-800'
        }, 'A solução recomendada é migrar todos os dados para um novo projeto limpo usando a ferramenta de migração que foi criada especificamente para esta situação.')
      ])
    ])
  ]);
}

export default App;