import Layout from '@/components/layout';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import 'pretendard/dist/web/variable/pretendardvariable.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider
      theme={extendTheme({
        fonts: { heading: 'Pretendard', body: 'Pretendard' },
      })}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
