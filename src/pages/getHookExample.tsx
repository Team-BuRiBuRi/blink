import useGetShop from '@/hooks/useGetShop';

export default function Page() {
  const { isLoading, isSuccessful, isError, getShop } = useGetShop();

  const handleUpdate = async () => {
    await getShop({ id: 1 });
  };

  return (
    <div>
      <button onClick={handleUpdate} disabled={isLoading}>
        Update Shop
      </button>

      {isLoading && <p>Updating...</p>}

      {isSuccessful && <p>Update was successful!</p>}

      {isError && <p>Error</p>}
    </div>
  );
}
