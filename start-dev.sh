#!/bin/bash

# Start development servers for AI Workshop
echo "🚀 Starting AI Workshop Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping servers..."
    kill $FRONTEND_PID $EMAIL_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start email server in background
echo "📧 Starting email server on port 3001..."
cd server && npm start &
EMAIL_PID=$!

# Wait a moment for email server to start
sleep 3

# Start frontend development server
echo "🌐 Starting frontend development server on port 5174..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "📧 Email server: http://localhost:3001"
echo "🌐 Frontend: http://localhost:5174"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $FRONTEND_PID $EMAIL_PID
