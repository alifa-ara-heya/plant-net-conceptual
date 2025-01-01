import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utils';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AddPlant = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false); //this loading is only for the loading state when posting data in db in the 'save and continue' button 
  const axiosSecure = useAxiosSecure();

  // const [uploadButtonText, setUploadButtonText] = useState({ name: 'Upload Image' });
  const [uploadImage, setUploadImage] = useState({
    image: {
      name: 'Upload Image'
    }
  });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageUrl = await imageUpload(image);

    //seller info
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }

    //create plant data object
    const plantData = {
      name,
      description,
      category,
      price,
      quantity,
      image: imageUrl,
      seller
    }

    console.table(plantData);

    // save plant in db
    try {
      const { data } = await axiosSecure.post('/plants', plantData)
      console.log(data);
      if (data.insertedId) {
        toast.success('Plant added successfully.')
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }

  }


  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        handleSubmit={handleSubmit}
        // uploadButtonText={uploadButtonText}
        // setUploadButtonText={setUploadButtonText}
        loading={loading}
        uploadImage={uploadImage}
        setUploadImage={setUploadImage} />
    </div>
  )
}

export default AddPlant
