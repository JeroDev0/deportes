import { useEffect, useState } from 'react';
import AthleteCard from './AthleteCard';
import Modal from '../Modal/Modal';
import styles from './AthleteList.module.css';
import { useAuth } from '../../context/useAuth.js';
import { useNavigate } from 'react-router-dom';

function AthleteList({ limit = 12, showSeeMore = false }) {
  const [athletes, setAthletes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://deportes-production.up.railway.app/deportistas')
      .then(res => res.json())
      .then(data => {
        setAthletes(data);
      });
  }, []);

  const handleCardClick = (athleteId) => {
    if (user) {
      navigate(`/profile/${athleteId}`);
    } else {
      setModalOpen(true);
    }
  };

  const handleSeeMore = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setModalOpen(true);
    }
  };

  // Solo mostrar los primeros "limit" atletas
  const visibleAthletes = limit ? athletes.slice(0, limit) : athletes;

  return (
    <>
      <div className={styles.gridDashboard}>
        {visibleAthletes.map(athlete => (
          <AthleteCard key={athlete._id} athlete={athlete} onClick={() => handleCardClick(athlete._id)} />
        ))}
      </div>
      {showSeeMore && athletes.length > limit && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={handleSeeMore}
            className={styles.seeMoreBtn}
          >
            See more profiles →
          </button>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Sign up or log in!</h2>
        <p>You must register or log in to view this athlete's profile and contact them.</p>
        <div style={{ marginTop: '1.2rem' }}>
          <a href="/login" style={{ marginRight: '1rem', color: '#7209b7', fontWeight: 600 }}>Log in</a>
          <a href="/register" style={{ color: '#3a0ca3', fontWeight: 600 }}>Register</a>
        </div>
      </Modal>
    </>
  );
}

export default AthleteList;