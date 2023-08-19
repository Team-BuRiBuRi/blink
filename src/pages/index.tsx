import Logo from '@/assets/logo.svg';
import { LineChart } from '@/components/linechart';
import useGetExchangeRate from '@/hooks/useGetExchangeRate';
import useGetLiveExchangeRate from '@/hooks/useGetLiveExchangeRate';
import useGetProducts from '@/hooks/useGetProducts';
import useGetShop from '@/hooks/useGetShop';
import usePatchShop from '@/hooks/usePatchShop';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Input,
  Skeleton,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { format } from 'd3-format';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineSearch } from 'react-icons/ai';
const PRIMARY_COLOR = '#E2674E';

export default function Home() {
  const router = useRouter();
  const [shopId, setShopId] = useState(1);
  const [isBTC, setIsBTC] = useState(false);
  const [exchangeRate, setExchangeRate] =
    useState<GetAppliedExchangeRateResponse>({
      ars: '500',
      btc: '10000000',
    });
  const [fee, setFee] = useState(1);
  const [fromCurrency, setFromCurrency] = useState({
    currency: 'USD',
    price: '100',
  });
  const [toCurrency, setToCurrency] = useState({
    currency: 'ARS',
    price: '100',
  });
  const [liveRate, setLiveRate] = useState<Price[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

  const { getShop } = useGetShop();
  const { patchShop } = usePatchShop();
  const { getExchangeRate } = useGetExchangeRate();
  const { getLiveExchangeRate } = useGetLiveExchangeRate();
  const { getProducts } = useGetProducts();

  useEffect(() => {
    const fetchShop = async () => {
      const rate = await getExchangeRate();
      if (rate) setExchangeRate(rate);
      const shop = await getShop({ id: shopId });
      if (shop) setFee(parseFloat(shop.fee));
      const xeResponse = await getLiveExchangeRate({
        from: 'USD',
        to: isBTC ? 'BTC' : 'ARS',
        start: '2023-08-11',
        end: '2023-08-17',
      });
      if (xeResponse) {
        setLiveRate(xeResponse.to[isBTC ? 'BTC' : 'ARS']);
      }
      const products = await getProducts({ shopId });
      if (products !== null) setProductList(products);
      console.log(products);
    };
    fetchShop();
  }, [isBTC]);

  const updateUserPrice = async () => {
    if (liveRate.length === 0) return;
    if (Number(toCurrency.price) <= 0 || Number(fromCurrency.price) <= 0) {
      console.log('nan될뻔');
      return;
    }

    const currentExchangeRate = isBTC ? exchangeRate.btc : exchangeRate.ars;
    console.log(currentExchangeRate, toCurrency.price, fromCurrency.price);

    const newFee =
      parseFloat(toCurrency.price) /
      (parseFloat(fromCurrency.price) * liveRate[liveRate.length - 1]?.mid);

    console.log(newFee);
    await patchShop({
      id: shopId,
      fee: `${newFee}`,
    });
  };

  return (
    <Flex gap={'20px'} flexDir={'column'}>
      <Flex justifyContent={'space-between'} align={'center'} mt='24px'>
        <Image src={Logo} alt='logo' />
        <Icon as={AiOutlineSearch} boxSize={'24px'} />
      </Flex>
      <Flex justify={'start'} align={'center'} gap={11}>
        <Avatar
          w={'24px'}
          h={'24px'}
          name='Dan Abrahmov'
          src='https://bit.ly/dan-abramov'
        />
        <Heading fontWeight={600} fontSize={'22px'}>
          {"Maria's Dashboard"}
        </Heading>
      </Flex>
      <Tabs w='full' colorScheme='orange'>
        <TabList>
          <Tab w='full'>Exchange Rate</Tab>
          <Tab w='full'>Product List</Tab>
        </TabList>

        <TabPanels>
          <TabPanel padding='20px 0 0 0'>
            <Flex direction={'column'} gap={'20px'}>
              <Flex justifyContent={'space-between'} align={'center'}>
                <Heading fontWeight={500} size={'20px'}>
                  Exchange Rate
                </Heading>
                <Flex
                  flexDir={'row'}
                  bgColor={'gray.200'}
                  width={'fit-content'}
                  borderRadius={100}
                  p={'5px'}
                  alignItems={'center'}
                >
                  <Center
                    bgColor={isBTC ? 'white' : undefined}
                    borderRadius={20}
                    w={'46px'}
                    h={'26px'}
                    fontSize={'11px'}
                    onClick={() => setIsBTC(true)}
                    cursor='pointer'
                  >
                    <Text fontWeight={500}>BTC</Text>
                  </Center>
                  <Box w={2} />
                  <Center
                    bgColor={isBTC ? undefined : 'white'}
                    borderRadius={20}
                    w={'46px'}
                    h={'26px'}
                    fontSize={'11px'}
                    onClick={() => setIsBTC(false)}
                    cursor='pointer'
                  >
                    <Text fontWeight={500}>ARS</Text>
                  </Center>
                </Flex>
              </Flex>
              {liveRate.length > 0 ? (
                <Flex
                  p={2}
                  justify='center'
                  bg='white'
                  borderRadius='20px'
                  boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
                >
                  <LineChart
                    width={375}
                    height={200}
                    margin={{ top: 10, right: 10, bottom: 30, left: 50 }}
                    fee={fee}
                    data={liveRate}
                    currency={isBTC ? 'BTC' : 'ARS'}
                  />
                </Flex>
              ) : (
                <Skeleton
                  width={315}
                  height={216}
                  borderRadius='20px'
                ></Skeleton>
              )}
              <Text fontSize='md' fontWeight={500}>
                Set User Price
              </Text>
              <Flex gap={2} align='center' dir='row'>
                <Text fontSize={'11px'} fontWeight={600} mr='5px'>
                  USD
                </Text>
                <Input
                  placeholder='100'
                  bgColor={'white'}
                  onChange={(e) =>
                    setFromCurrency({
                      ...fromCurrency,
                      price: `${e.target.value}`,
                    })
                  }
                />
                <Icon as={AiOutlineArrowRight} size={'24px'} />
                <Text fontSize={'11px'} fontWeight={600} mr='5px'>
                  {isBTC ? 'BTC' : 'ARS'}
                </Text>
                <Input
                  placeholder='100'
                  bgColor={'white'}
                  onChange={(e) =>
                    setToCurrency({
                      ...toCurrency,
                      price: `${e.target.value}`,
                    })
                  }
                />
              </Flex>
              <Spacer />
              <Button
                w='full'
                bgColor={'#E2674E'}
                color={'white'}
                borderRadius={6}
                p={'6px'}
                mt={5}
                onClick={async () => {
                  await updateUserPrice();
                }}
              >
                Update
              </Button>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex direction={'column'} gap={'20px'}>
              <Flex justify={'space-between'}>
                <Spacer />
                <Button
                  size={'sm'}
                  onClick={() => {
                    router.push('/product-add');
                  }}
                >
                  Add an Item
                </Button>
              </Flex>
              {productList.length > 0 ? (
                productList.map((product, i) => (
                  <ProductEntity
                    key={`${i}`}
                    product={product}
                    exchangeRate={exchangeRate}
                  />
                ))
              ) : (
                <Flex gap={'20px'} flexDirection={'column'}>
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                  <Skeleton height={108.5} borderRadius='20px' />
                </Flex>
              )}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

interface ProductEntityProp {
  product: Product;
  exchangeRate: AppliedExchangeRate;
}

const ProductEntity = ({ product, exchangeRate }: ProductEntityProp) => {
  const router = useRouter();
  const usdPrice = product.price;
  const arsPrice = parseFloat(usdPrice) * parseFloat(exchangeRate.ars);
  const btcPrice = parseFloat(usdPrice) * parseFloat(exchangeRate.btc);

  return (
    <Flex
      px={5}
      py={3}
      gap={2}
      justify='center'
      bg='white'
      borderRadius='20px'
      boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
      flexDir={'column'}
      onClick={() => {
        router.push(`/product/${product.id}`);
      }}
      cursor='pointer'
    >
      <Flex gap={'12px'} align={'center'}>
        <Center w={'60px'} h={'60px'} borderRadius={10} overflow={'hidden'}>
          <Image
            width={60}
            height={60}
            src={`data:image/jpg;base64,${product.thumbnail}`}
            objectFit='contain'
            alt='thumbnail'
          />
        </Center>
        <Text fontSize={'18px'} fontWeight={500}>
          {product.name}
        </Text>
      </Flex>
      <Flex flexDir={'row'}>
        <Text fontSize={'11px'} fontWeight={600} mr='5px'>
          {usdPrice}
        </Text>
        <Text
          fontSize={'11px'}
          fontWeight={500}
          color={'blackAlpha.600'}
          mr='9px'
        >
          USD
        </Text>
        <Text fontSize={'11px'} fontWeight={600} mr='5px'>
          {format('.4s')(arsPrice)}
        </Text>
        <Text
          fontSize={'11px'}
          fontWeight={500}
          color={'blackAlpha.600'}
          mr='9px'
        >
          ARS
        </Text>
        <Text fontSize={'11px'} fontWeight={600} mr={'5px'}>
          {format('.5e')(btcPrice)}
        </Text>
        <Text
          fontSize={'11px'}
          fontWeight={500}
          color={'blackAlpha.600'}
          mr={'9px'}
        >
          BTC
        </Text>
      </Flex>
    </Flex>
  );
};
