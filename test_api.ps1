$ErrorActionPreference = "Stop"

echo "1. Logging in..."
$login = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method Post -Body (@{username="admin"; password="admin123"} | ConvertTo-Json) -ContentType "application/json"
$token = $login.token
echo "Token obtained."

echo "2. Testing Add Customer..."
try {
    $newCustomer = Invoke-RestMethod -Uri "http://localhost:5001/api/customers" -Method Post -Headers @{Authorization="Bearer $token"} -Body (@{username="testuser"; password="pw"; name="Test User"; email="t@t.com"} | ConvertTo-Json) -ContentType "application/json"
    echo "Customer Added: $($newCustomer.username)"
} catch {
    echo "Add Customer Failed: $_"
}

echo "3. Testing Get Customers..."
try {
    $customers = Invoke-RestMethod -Uri "http://localhost:5001/api/customers" -Method Get -Headers @{Authorization="Bearer $token"}
    echo "Customers Found: $($customers.Count)"
} catch {
    echo "Get Customers Failed: $_"
}

echo "4. Testing Search Books..."
try {
    $books = Invoke-RestMethod -Uri "http://localhost:5001/api/books?search=gatsby&type=title" -Method Get -Headers @{Authorization="Bearer $token"}
    echo "Search Results: $($books.Count)"
} catch {
    echo "Search Failed: $_"
}
