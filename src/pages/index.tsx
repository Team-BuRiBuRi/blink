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
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlinePlus } from 'react-icons/ai';
const PRIMARY_COLOR = '#E2674E';
const exchangeRate: AppliedExchangeRate = {
  ars: '100',
  btc: '0.0001',
};
const dummy: Product = {
  id: 1,
  name: 'Product Name',
  thumbnail: '',
  shopId: 1,
  price: '200',
  buyPrice: '100',
  buyQuantity: 20,
  totalSales: '2000',
  totalSalesQuantity: 10,
};

export default function Home() {
  const [shopId, setShopId] = useState(1);
  const [isBTC, setIsBTC] = useState(false);
  const [exchangeRate, setExchangeRate] =
    useState<GetAppliedExchangeRateResponse>({
      ars: '100',
      btc: '0.0001',
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

  const getShop = useGetShop();
  const patchShop = usePatchShop();
  const getExchangeRate = useGetExchangeRate();
  const getLiveExchangeRate = useGetLiveExchangeRate();
  const getProductList = useGetProducts();

  useEffect(() => {
    const fetchShop = async () => {
      const rate = await getExchangeRate.getExchangeRate();
      if (rate) setExchangeRate(rate);
      const shop = await getShop.getShop({ id: shopId });
      if (shop) setFee(parseFloat(shop.fee));
      const xeResponse = await getLiveExchangeRate.getLiveExchangeRate({
        from: 'USD',
        to: isBTC ? 'BTC' : 'ARS',
        start: '2023-08-11',
        end: '2023-08-17',
      });
      if (xeResponse) {
        setLiveRate(xeResponse.to[isBTC ? 'BTC' : 'ARS']);
      }
    };
    fetchShop();
  }, [isBTC]);

  const updateUserPrice = () => {
    const currentExchangeRate = isBTC ? exchangeRate.btc : exchangeRate.ars;
    console.log(currentExchangeRate, toCurrency.price, fromCurrency.price);

    const newFee =
      parseFloat(toCurrency.price) /
      (parseFloat(fromCurrency.price) * liveRate[liveRate.length - 1].mid);

    console.log(newFee);
    patchShop.patchShop({
      id: shopId,
      fee: `${newFee}`,
    });
  };

  return (
    <Flex gap={'20px'} flexDir={'column'}>
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
      <Tabs w='full' colorScheme='red'>
        <TabList>
          <Tab w='full'>Exchange Rate</Tab>
          <Tab w='full'>Product List</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
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
                    fontSize={'14px'}
                    onClick={() => setIsBTC(true)}
                  >
                    <Text fontWeight={500}>BTC</Text>
                  </Center>
                  <Box w={2} />
                  <Center
                    bgColor={isBTC ? undefined : 'white'}
                    borderRadius={20}
                    w={'46px'}
                    h={'26px'}
                    fontSize={'14px'}
                    onClick={() => setIsBTC(false)}
                  >
                    <Text fontWeight={500}>ARS</Text>
                  </Center>
                </Flex>
              </Flex>
              <Flex
                p={2}
                justify='center'
                bg='white'
                borderRadius='20px'
                boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
              >
                {liveRate && (
                  <LineChart
                    width={375}
                    height={200}
                    margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                    data={liveRate}
                    fee={fee}
                  />
                )}
              </Flex>

              <Text fontSize='md' fontWeight={500}>
                Set User Price
              </Text>
              <Flex gap={2} align='center' dir='row'>
                <Text fontSize={'14px'} fontWeight={600} mr='5px'>
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
                <Text fontSize={'14px'} fontWeight={600} mr='5px'>
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
                onClick={() => {
                  updateUserPrice();
                }}
              >
                Update
              </Button>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex direction={'column'} gap={'20px'}>
              <Flex justify={'space-between'}>
                <Heading fontWeight={500} size={'24px'}>
                  Product List
                </Heading>
                <Icon as={AiOutlinePlus} size={'24px'} />
              </Flex>
              {[dummy, dummy, dummy].map((product, i) => (
                <ProductEntity
                  key={`${i}`}
                  product={product}
                  exchangeRate={exchangeRate}
                />
              ))}
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
  const usdPrice = product.price;
  const arsPrice = parseFloat(usdPrice) * parseFloat(exchangeRate.ars);
  const btcPrice = parseFloat(usdPrice) * parseFloat(exchangeRate.btc);

  return (
    <Flex
      px={5}
      py={3}
      gap={1}
      justify='center'
      bg='white'
      borderRadius='20px'
      boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
      flexDir={'column'}
    >
      <Flex gap={'10px'} align={'center'}>
        <Box bgColor='blue.500' w={'60px'} h={'60px'} />
        <Text fontSize={'18px'} fontWeight={500}>
          {product.name}
        </Text>
      </Flex>
      <Flex flexDir={'row'}>
        <Text fontSize={'14px'} fontWeight={600} mr='5px'>
          {usdPrice}
        </Text>
        <Text
          fontSize={'14px'}
          fontWeight={500}
          color={'blackAlpha.600'}
          mr='9px'
        >
          USD
        </Text>
        <Text fontSize={'14px'} fontWeight={600} mr='5px'>
          {arsPrice}
        </Text>
        <Text
          fontSize={'14px'}
          fontWeight={500}
          color={'blackAlpha.600'}
          mr='9px'
        >
          ARS
        </Text>
        <Text fontSize={'14px'} fontWeight={600} mr={'5px'}>
          {btcPrice}
        </Text>
        <Text
          fontSize={'14px'}
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
