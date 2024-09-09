import { QueryClient, QueryClientProvider } from "react-query";

function BaseQueryProvider({ children }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default BaseQueryProvider;
