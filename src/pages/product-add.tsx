import ImageInput from '@/components/ImageInput';
import { Box, Button, Flex, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';

const AddProductPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clickFileInputRef = () =>
    fileInputRef.current && fileInputRef.current.click();
  return (
    <Flex direction='column' gap='20px' minHeight='100vh'>
      <Flex w='100%' align='center' gap='10px' mt='15px'>
        <Box
          cursor='pointer'
          onClick={() => {
            router.push('/');
          }}
        >
          <MdArrowBackIosNew size='24px' />
        </Box>
        <Text fontSize='22px' fontWeight='700' flex={1}>
          Add an Item
        </Text>
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item name
        </Text>
        <Input />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item image
        </Text>
        <ImageInput onClickInput={clickFileInputRef} ref={fileInputRef} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Cost price
        </Text>
        <Input type='number' />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Total count
        </Text>
        <Input type='number' />
      </Flex>
      <Box flex={1} />
      <SimpleGrid columns={2} gap='11px' pb='26px'>
        <Button colorScheme='gray'>Cancel</Button>
        <Button colorScheme='red'>Complete</Button>
      </SimpleGrid>
    </Flex>
  );
};

export default AddProductPage;
