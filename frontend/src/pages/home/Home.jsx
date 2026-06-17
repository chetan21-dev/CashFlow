import styles from "../home/home.module.css"

const Home = () => {
  return (
    <div class={styles.hero}>
      <div class={styles.overlay}>
        <h1>Secure Money Transfers, Anytime</h1>
        <p>
          Transfer funds instantly and securely between accounts. Fast
          transactions, reliable protection, and complete peace of mind.
        </p>
      </div>
    </div>
  );
};

export default Home;
