import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta name='description' content='Junction Asia 2023 우승작' />
        <link
          rel='preload'
          href='/fonts/Pretendard-Black.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-Bold.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-ExtraBold.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-ExtraLight.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-Light.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-Medium.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-Regular.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-SemiBold.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Pretendard-Thin.woff2'
          as='font'
          type='font/woff2'
          crossOrigin=''
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
