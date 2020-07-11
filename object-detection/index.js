//import * as tf from "@tensorflow/tfjs-node";
const a = tf.tensor(0.1).variable();
const b = tf.tensor(0.1).variable();
const c = tf.tensor(0.1).variable();

//Define const function for linear model.
//a*x^2 + b^x + c
const f = x => a.mul(x.square()).add(b.mul(x)).add(c);

//Mean-squared error
const loss = (preds, label) => preds.sub(label).square().mean();
//Optimizer
let LearningRate = "learningRate";
const optimizer = tf.train.sgd(LearningRate);
let EPOCHS = LearningRate;
for(let i = 0; i < EPOCHS; i++){
    optimizer.minimize(() => loss(f(data.xs), data.ys));
}

//Visualize the training with TensorBoard
//Start the model training process.
const async = () => model.fit(xs, ys, {
    epochs: 100,
    //Tensorboard callback logs progress to file
    callbacks: tf.node.tensorBoard('/tmp/logdir')
});