import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { submitContactForm } from '../utils/firebaseApi'
import { testFirebaseConnection } from '../utils/firebaseApi'

export function FirebaseTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [isTesting, setIsTesting] = useState(false)

  const runConnectionTest = async () => {
    setIsTesting(true)
    setTestResult('Testing...')
    
    try {
      const result = await testFirebaseConnection()
      setTestResult(result ? '✅ Connection successful!' : '❌ Connection failed!')
    } catch (error) {
      setTestResult(`❌ Error: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  const testContactForm = async () => {
    setIsTesting(true)
    setTestResult('Testing contact form...')
    
    try {
      const response = await submitContactForm({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test submission',
        form_type: 'contact_section'
      })
      
      if (response.success) {
        setTestResult('✅ Contact form test successful!')
      } else {
        setTestResult(`❌ Contact form failed: ${response.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Contact form error: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Firebase Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={runConnectionTest} 
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <Button 
            onClick={testContactForm} 
            disabled={isTesting}
            variant="outline"
            className="w-full"
          >
            {isTesting ? 'Testing...' : 'Test Contact Form'}
          </Button>
        </div>
        
        {testResult && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Check browser console for detailed logs</p>
          <p>You can also run: window.testFirebase() in console</p>
        </div>
      </CardContent>
    </Card>
  )
}
