import { useParams } from 'react-router-dom';
import Home from './IndexPage';

const NamespacePage = () => {
  const { namespace } = useParams();

  return <Home initialNamespace={namespace} />;
};

export default NamespacePage;