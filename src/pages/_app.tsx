import font from '@/components/fonts';
import Layout from '@/components/layout';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider
      theme={extendTheme({
        fonts: {
          heading: 'Pretendard',
          body: 'Pretendard',
        },
      })}
    >
      <Global styles={font} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
