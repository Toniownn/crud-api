# Skill: Create React Page Component

## When to Use
When you need to create a new page/view in the React frontend.

## Conventions
- Location: `client/src/pages/<Name>.jsx` (or `client/src/pages/admin/<Name>.jsx` for admin)
- Functional components with hooks (`useState`, `useEffect`)
- Import API functions from `../api/<module>`
- Import `useAuth` from `../context/AuthContext` when auth state is needed
- Import `AlertModal` from `../components/AlertModal` for success/error feedback
- Use `useNavigate` from react-router-dom for navigation
- Use `useParams` for URL route parameters

## Styling (Tailwind CSS v4)
- Page wrapper: `max-w-4xl mx-auto p-6` (or `max-w-2xl`, `max-w-6xl`)
- Cards: `bg-white shadow rounded p-6`
- Primary buttons: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium`
- Danger buttons: `bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm`
- Inputs: `border border-gray-300 rounded px-3 py-2 text-gray-800`
- Tables: `bg-gray-100` header, `border-t border-gray-200` rows
- Admin pages: wrap content in `<AdminLayout>` from `../../components/AdminLayout`

## After Creating
- Add route in `client/src/App.jsx`
- Wrap with `<ProtectedRoute>` or `<AdminRoute>` as needed
- Add nav link in `client/src/components/Navbar.jsx` if needed
