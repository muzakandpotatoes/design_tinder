import { useAppContext } from '../context/AppContext';

function CollectionSelector() {
  const { collections, currentCollection, setCurrentCollection } = useAppContext();

  if (collections.length <= 1) return null;

  const handleChange = (e) => {
    const selected = collections.find(c => c.id === e.target.value);
    if (selected) setCurrentCollection(selected);
  };

  return (
    <select
      className="collection-selector"
      value={currentCollection?.id ?? ''}
      onChange={handleChange}
    >
      {collections.map(c => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default CollectionSelector;
