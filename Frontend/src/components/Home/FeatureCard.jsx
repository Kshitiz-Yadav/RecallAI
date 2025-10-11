import { styles } from '../../styles';

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className={styles.card.base}>
    <div className={`${styles.card.icon} ${styles.card.iconGradient} ${gradient}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className={styles.card.title}>{title}</h3>
    <p className={styles.card.description}>{description}</p>
  </div>
);

export default FeatureCard;