# Create React Page Component

Create a new page component in `client/src/pages/`.

## Arguments
- `$ARGUMENTS` — Page name and description, e.g. "Catalog: product grid with search, category filter, pagination"

## Instructions

1. Create the page file at `client/src/pages/<Name>.jsx` (or `client/src/pages/admin/<Name>.jsx` for admin pages)
2. Follow existing project conventions:
   - Use functional components with hooks (`useState`, `useEffect`)
   - Import API functions from `../api/<module>`
   - Import `useAuth` from `../context/AuthContext` if auth state is needed
   - Import `AlertModal` from `../components/AlertModal` for success/error messages
   - Use Tailwind CSS v4 utility classes for all styling (no CSS modules or inline styles)
   - Use the same color scheme: `bg-gray-100` body, `bg-white shadow rounded` cards, `bg-blue-600` primary buttons
   - Forms use `border border-gray-300 rounded px-3 py-2 text-gray-800` input styling
   - Use `useNavigate` from react-router-dom for navigation
3. After creating the page, remind to add the route in `App.jsx`
4. Return the file path when done
