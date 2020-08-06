// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable no-template-curly-in-string */

export const MARKETPLACE_API_URL = process.env.MARKETPLACE_API_URL;

export const MARKET_ITEM_LIST = [
  {
    id: '0b41d10e-36e5-4e97-95c2-27726dd94f34',
    name: 'Couplet Dataset',
    author: 'OpenPAI',
    type: 'data',
    categories: 'AI couplet',
    tags: ['official example'],
    summary: 'Dataset of couplet',
    description:
      '# Couplet Dataset\n\nThis is the dataset of couplet. \n\n## Data content\n\nThis dataset contains processed data based on [Microsoft AI EDU project](https://github.com/microsoft/ai-edu/blob/master/B-%E5%AE%9E%E8%B7%B5%E6%A1%88%E4%BE%8B/B13-AI%E5%AF%B9%E8%81%94%E7%94%9F%E6%88%90%E6%A1%88%E4%BE%8B/docs/fairseq.md).\n\nThe original dataset was downloaded from [Public couplet dataset](https://github.com/wb14123/couplet-dataset) and was splited into ```test, train and valid``` with 98:1:1 proportion. The ```.up``` and ```.down``` files contains upper part and down part of a certain couplet seperately.\n\n## The file stucture\n\n```\n.\n|-- test.down // down part of couplet\n|-- test.up  // up part of couplet\n|-- train.down\n|-- train.up\n|-- valid.down\n|-- valid.up\n```\n\n## How to use it\n\nThe data will be mounted at ```DATA_DIR``` environment variable. You could use ```$DATA_DIR``` in your command when submit jobs in pai.\n\n\n',
    content: {
      dataStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/couplet_data',
        containerPath: '/mnt/confignfs/couplet_data',
      },
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-26T04:52:48.289Z',
    updatedAt: '2020-07-26T04:52:48.289Z',
  },
  {
    id: '8e0b3086-0359-4e75-b11c-c5527487626e',
    name: 'Couplet Training Job Template',
    author: 'OpenPAI',
    type: 'template',
    categories: 'AI couplet',
    tags: ['official example'],
    summary: 'Dataset of couplet',
    description:
      '# Couplet Training Model\n\nThis is a model training process. After training, this model will give a down part with an upper part of couplet. Please refer to Microsoft AI Edu Project for more details.\n\n## Training Data\n\nYou could use Couplet Dataset data component as training data, or any dataset follows fairseq model requirements.\n\n## How to use\n\nWhen use this module, you should set three environment variables:\n\n- ```DATA_DIR```: the training data path in container, by default it uses Couplet Dataset data component. If you want to use your own datasets. First make sure mount your data into container, and then change the ```$DATA_DIR``` with the path.\n\n- PREPROCESSED_DATA_DIR: the path to store intermediate result, by default it is ./processed_data.\n\n- ```OUTPUT_DIR```: the path to store output result, i.e. the training model files. By default it will mount a nfs storage, and you could change it with other mounted storage.\n\n## How to check the result\n\nAfter job finished successfully, you could check the output model files in the output storage. The storage server url is in details page.\n',
    content: {
      dockerImage: 'openpai/standard:python_3.6-pytorch_1.2.0-gpu',
      ports: [],
      dataStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/couplet_data',
        containerPath: '/mnt/confignfs/couplet_data',
      },
      codeStorage: null,
      outputStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/output',
        containerPath: '/mnt/confignfs/output',
      },
      commands: [
        'export PREPROCESSED_DATA_DIR=./preprocessed_data',
        'pip install fairseq',
        'fairseq-preprocess \\',
        '--source-lang up \\',
        '--target-lang down \\',
        '--trainpref ${DATA_DIR}/train \\',
        '--validpref ${DATA_DIR}/valid \\',
        '--testpref ${DATA_DIR}/test \\',
        '--destdir ${PREPROCESSED_DATA_DIR}',
        'fairseq-train ${PREPROCESSED_DATA_DIR} \\',
        '--log-interval 100 \\',
        '--lr 0.25 \\',
        '--clip-norm 0.1 \\',
        '--dropout 0.2  \\',
        '--criterion label_smoothed_cross_entropy \\',
        '--save-dir ${OUTPUT_DIR} \\',
        '-a lstm \\',
        '--max-tokens 4000 \\',
        '--max-epoch 100',
      ],
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-26T04:52:48.289Z',
    updatedAt: '2020-07-26T04:52:48.289Z',
  },
  {
    id: 'a493d4cf-a79e-490f-95c9-06900cdcbd98',
    name: 'Couplet Inference Job Template',
    author: 'OpenPAI',
    type: 'template',
    categories: 'AI couplet',
    tags: ['official example'],
    summary: 'Dataset of couplet',
    description:
      '# Couplet Training Job Template\n\nThis is a model inference process. The input data is the trainning models trained by ```couplet training job```, and the this job will produce a url for user to ask for down part for a upper part of couplet.\n\n## How to use\n\nWhen use this module, you should set three environment variables:\n\n- ```DATA_DIR```: the training model path in container, by default it uses the output of couplet training job. If you want to use your own models. First make sure mount your models into container, and then change the ```$DATA_DIR``` with the path.\n\n- ```CODE_DIR```: the service code, it will start a server at the given port.\n\n- ```FLASK_RUN_PORT```: the service port container will output.\n\n## How to check the result\n\nAfter job finished successfully, you could check the job detail to get the container ip and ```flask_port``` number, then go to http://<ip>:<flask_port>/?upper=<input> to test the result.\n',
    content: {
      dockerImage: 'openpai/standard:python_3.6-pytorch_1.2.0-gpu',
      ports: ['FLASK_PORT'],
      dataStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/couplet/checkpoints',
        containerPath: '/mnt/confignfs/couplet/checkpoints',
      },
      codeStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/couplet',
        containerPath: '/mnt/confignfs/couplet',
      },
      commands: [
        'pip install fairseq',
        'pip install flask',
        'pip install gunicorn',
        'cd ${CODE_DIR}',
        'gunicorn --bind=0.0.0.0:${FLASK_PORT} app:app',
      ],
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-26T04:52:48.289Z',
    updatedAt: '2020-07-26T04:52:48.289Z',
  },
  {
    id: '48eacbd1-fab7-4738-bf3f-457f0a857f17',
    name: 'Coronavirus Public Dataset',
    author: 'MSRA',
    type: 'data',
    categories: 'COVID19',
    tags: ['official example'],
    summary:
      'Provides up-to-date data about Coronavirus outbreak. Includes numbers about confirmed cases, deaths and recovered. Support multiple data-sources.',
    description:
      '# Coronavirus Public Dataset\n\nThis dataset is downloaded from [Coronavirus Tracker API](https://github.com/ExpDev07/coronavirus-tracker-api). It provides up-to-date data about Coronavirus outbreak, including numbers about confirmed cases, deaths and recovered. Please refer to the project for more details.\n\n## Dataset Introduction\n\nCurrently 3 different data-sources are available to retrieve the data:\n\n- **jhu** - https://github.com/CSSEGISandData/COVID-19 - Worldwide Data repository operated by the Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE).\n\n- **csbs** - https://www.csbs.org/information-covid-19-coronavirus - U.S. County data that comes from the Conference of State Bank Supervisors.\n\n- **nyt** - https://github.com/nytimes/covid-19-data - The New York Times is releasing a series of data files with cumulative counts of coronavirus cases in the United States. This API provides the timeseries at the US county level.\n\n**jhu** data-source will be used as a default source if you don not specify a _source parameter_ in your request.\n\n## The file stucture\n\n```\n.\n|-- covid-19_data_<date>.json\n```\n\nThe suffix <date> indicates the date when it was downloaded. The data source will update by date.\n\n## How to use\n\nThe data will be mounted at ```DATA_DIR``` environment variable. You could use ```$DATA_DIR``` in your command when submit jobs in pai.\n\nYou could also fetch data from https://coronavirus-tracker-api.herokuapp.com/all api, and use it directly.\n',
    content: {
      dataStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/covid19/data',
        containerPath: '/mnt/confignfs/covid19/data',
      },
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '7b45274e-726a-4585-928c-e0513c8618ab',
    name: 'Covid19 Prediction Model',
    author: 'MSRA',
    type: 'template',
    categories: 'AI couplet',
    tags: ['official example'],
    summary: 'Covid19 prediction model of confirmed and death number.',
    description:
      '# Covid19 prediction model of confirmed and death number\n\nThis is a prediction model of confirmed and death number in different countries. This model uses dataset published by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University. With this data set, the model could predict the confirmed and death number of population of different dates.\n\n## Training Data\n\nThe training data is fetched by [Coronavirus Tracker API](https://github.com/ExpDev07/coronavirus-tracker-api). You could provide a formatted data as the training data, there is a default dataset downloaded ahead in the data storage. If no input data given, the model will auto download latest dataset from Coronavirus Tracker API.\n\n## How to use\n\nWhen use this module, you should set three environment variables:\n\n- `DATA_DIR`: the training data path in container, by default it uses Coronavirus Public Dataset. If you want to use your own datasets. First make sure mount your data into container, and then change the `$DATA_DIR` with the path.\n\n- `CODE_DIR`: the path to store model training code,it is mounted by code storage.\n\n- `OUTPUT_DIR`: the path to store output result, i.e. the prediction results. By default it will mount the output storage, and you could change it with other mounted storage.\n\n## How to check the result\n\nAfter job finished successfully, you could check the output result file in the output storage. Or you could use model service template and go to http://<ip>:<flask_port>/upper=<input> to see the visualization.\n',
    content: {
      dockerImage: 'openpai/standard:python_3.6-pytorch_1.2.0-gpu',
      dataStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/covid19/data',
        containerPath: '/mnt/confignfs/covid19/data',
      },
      codeStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/covid19/prediction_project',
        containerPath: '/mnt/confignfs/covid19/prediction_project',
      },
      outputStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/covid19/prediction_project/output',
        containerPath: '/mnt/confignfs/covid19/prediction_project/output',
      },
      commands: [
        'pip install numpy',
        'pip install scipy',
        'pip install sklearn',
        'cd ${CODE_DIR}',
        'python PredictionConfirmed.py -i ${DATA_DIR}/covid-19_data.json -o ${OUTPUT_DIR}',
      ],
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '62095ef8-aa18-4ed6-b11e-d61a602cef14',
    name: 'Covid19 Inference Service',
    author: 'MSRA',
    type: 'template',
    categories: 'AI couplet',
    tags: ['official example'],
    summary: 'Covid19 Inference Service of Prediction Model',
    description:
      '# Covid19 Inference Service of Prediction Model\n\nThis is the inference service to visualize the prediction number of confirmed and death population in different countries.\n\n## How to check the result\n\nAfter job finished successfully, you could check the output result file in the output storage. Or you could use model service template and go to http://<ip>:<flask_port>/upper=<input> to see the visualization.\n',
    content: {
      dockerImage: 'node:carbon',
      ports: ['SERVER_PORT'],
      codeStorage: {
        storageType: 'nfs',
        groups: ['default'],
        storageName: 'confignfs',
        serverPath: '10.151.40.235:/data/covid19/inference_project',
        containerPath: '/mnt/confignfs/covid19/inference_project',
      },
      commands: [
        'cp -r ${CODE_DIR} .',
        'cd inference_project',
        'ls',
        'echo please go to $PAI_HOST_IP_taskrole_0:$SERVER_PORT to view the result.',
        'npm install',
        'npm run build',
        'npm start',
      ],
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '69ff3c37-1405-49a7-b9de-47e640ba490c',
    name: 'Caffe2 Minist Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A caffe minist example',
    description:
      '  # Caffe MNIST Example\n  This example shows how to train LeNet on MNIST with Caffe on OpenPAI.\n\n  ## Dataset\n  The MNIST dataset is downloaded from MNIST website and converted into caffe format.\n\n  ## LeNet\n  This example will use the LeNet network, which is known to work well on digit classification tasks.\n  It will use a slightly different version from the original LeNet implementation,\n  replacing the sigmoid activations with Rectified Linear Unit (ReLU) activations for the neurons.\n\n  The design of LeNet contains the essence of CNNs that are still used in larger models such as the ones in ImageNet.\n  In general, it consists of a convolutional layer followed by a pooling layer, another convolution layer followed by a pooling layer,\n  and then two fully connected layers similar to the conventional multilayer perceptrons.\n  The layers are defined in `$CAFFE_ROOT/examples/mnist/lenet_train_test.prototxt`.\n\n  ## Reference\n  http://caffe.berkeleyvision.org/gathered/examples/mnist.htm',
    content: {
      config: 'caffe-mnist.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '9d3fbdad-dd82-429c-a368-f3d7b41717b5',
    name: 'Caffe2 ResNet50 Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A caffe resnet50 example',
    description:
      '# Caffe2 ResNet50 Example\n  This example shows using caffe2 to train ResNet50 with fake data on OpenPAI.',
    content: {
      config: 'caffe2-resnet50.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '5fa59045-c3f8-4243-88ff-89a1034681d8',
    name: 'Chainer Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A chainer example',
    description:
      'This is an [example chainer Docker image on OpenPAI](https://github.com/Microsoft/pai/tree/master/examples/chainer).',
    content: {
      config: 'chainer-cifar.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: 'd5f357d0-70cc-435c-92f2-21d63c7a1513',
    name: 'Horovod Pytorch',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A horovod pytorch example',
    description:
      'This is a distributed synthetic benchmark for Horovod with PyTorch backend running on OpenPAI.\nIt runs [Horovod with Open MPI](https://github.com/horovod/horovod/blob/master/docs/mpirun.rst).',
    content: {
      config: 'horovod-pytorch-synthetic-benchmark.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '55a21b76-abbe-4f75-9b09-ed0ee3accc16',
    name: 'Keras Tensorflow Mnist Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A keras tensorflow minist example',
    description:
      '# Keras Tensorflow Backend MNIST Digit Recognition Examples\n  Trains a simple convnet on the MNIST dataset.\n  Gets to 99.25% test accuracy after 12 epochs\n  (there is still a lot of margin for parameter tuning).\n  16 seconds per epoch on a GRID K520 GPU.\n\n  Reference https://github.com/keras-team/keras/blob/master/examples/mnist_cnn.py\n',
    content: {
      config: 'keras-tensorflow-mnist.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '56a0d871-fe2d-43ce-b26c-b89b9c0646fd',
    name: 'Mxnet Autoencoder Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Mxnet Autoencoder Example',
    description:
      '# MXNet Autoencoder Example\n  Autoencoder architectures are often used for unsupervised feature learning.\n  This [link](http://ufldl.stanford.edu/tutorial/unsupervised/Autoencoders/) contains an introduction tutorial to autoencoders.\n  This example illustrates a simple autoencoder using a stack of convolutional layers for both the encoder and the decoder.\n\n  The idea of an autoencoder is to learn to use bottleneck architecture to encode the input and then try to decode it to reproduce the original.\n  By doing so, the network learns to effectively compress the information of the input,\n  the resulting embedding representation can then be used in several domains.\n  For example as featurized representation for visual search, or in anomaly detection.\n\n  Reference https://github.com/apache/incubator-mxnet/tree/master/example/autoencoder',
    content: {
      config: 'mxnet-autoencoder.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: 'cc42d399-06d8-4b93-9e84-e5f609ef0c73',
    name: 'Pytorch Mnist Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Pytorch Mnist Example',
    description:
      'This is a basic PyTorch MNIST digit recognition example running on OpenPAI.\n  ```sh\n  python main.py\n  # CUDA_VISIBLE_DEVICES=2 python main.py  # to specify GPU id to ex. 2\n  ```',
    content: {
      config: 'pytorch-mnist.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '1c7efdef-40da-46d0-bdea-16c25e560380',
    name: 'Pytorch Regression Example',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Pytorch Regression Example',
    description:
      'This is a simple PyTorch regression example running on OpenPAI.\n  This example Trains a single fully-connected layer to fit a 4th degree polynomial.',
    content: {
      config: 'pytorch-regression.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '80cf9714-de4e-480b-8e26-66f529dbff6d',
    name: 'Rocm Pytorch Mnist',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Rocm Pytorch Example',
    description: 'PyTorch MNIST example on AMD GPUs.',
    content: {
      config: 'rocm-pytorch-mnist.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '44cbad87-c2d5-4433-9890-0883f07e3912',
    name: 'rocm_tensorflow2',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Rocm Tensorflow2 Example',
    description: 'TensorFlow2 example on AMD GPUs.',
    content: {
      config: 'rocm-pytorch-mnist.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '17c2500d-94ed-4e2d-af74-e1ace47987af',
    name: 'sklearn_text_vectorizers',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Scikit-learn Example',
    description:
      'This is a scikit-learn example on OpenPAI.\n  It is a speed benchmark for text vectorizer with scikit-learn.',
    content: {
      config: 'sklearn-text-vectorizers.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '4fb02608-3769-475c-a0c2-c2155fb03c4f',
    name: 'tensorflow_cifar10',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Tensorflow Distributed Example',
    description:
      '  # TensorFlow Distributed Training\n  This example runs TensorFlow Distributed Training on OpenPAI using CIFAR10.\n  Scripts are from TensorFlow Benchmarks repository, please refer to\n  https://github.com/tensorflow/benchmarks/tree/master/scripts/tf_cnn_benchmarks.',
    content: {
      config: 'tensorflow-cifar10.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
  {
    id: '74c8ab09-6225-4982-8145-5be0b5c55a28',
    name: 'tensorflow_serving_mnist',
    author: 'OpenPAI',
    type: 'old',
    categories: ['official example'],
    tags: ['official example'],
    summary: 'A Tensorflow Mnist Model Example',
    description:
      '# Serving a TensorFlow MNIST Digit Recognition Model\n  This example shows you how to use TensorFlow Serving components to export a trained TensorFlow model\n  and use the standard tensorflow_model_server to serve it on OpenPAI.\n  This example uses the simple Softmax Regression model introduced in the TensorFlow tutorial for handwritten image (MNIST data) classification.\n  Reference https://www.tensorflow.org/tfx/serving/serving_basic.',
    content: {
      config: 'tensorflow_serving_mnist.yaml',
    },
    useNumber: 0,
    starNumber: 0,
    status: 'approved',
    createdAt: '2020-07-28T04:52:48.289Z',
    updatedAt: '2020-07-28T04:52:48.289Z',
  },
];
