import React from 'react';
import RetroGrid from "../components/magicui/retro-grid";
import PulsatingButton from '../components/magicui/pulsating-button';
import HyperText from '../components/magicui/hyper-text';
import { useNavigate } from 'react-router-dom';
import BlurFade from "../components/magicui/blur-fade";
import { useTranslation} from 'react-i18next';

const lngs: { [key: string]: { nativeName: string } } = {
  en: { nativeName: 'English' },
  es: { nativeName: 'Español' }
};

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  function methodDoesNotExist(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="absolute top-5 right-5">
      return <button onClick={() => methodDoesNotExist()}>Break the world</button>;
        {Object.keys(lngs).map((lng) => (
          <button
            key={lng}
            style={{ fontWeight: i18n.language === lng ? 'bold' : 'normal' }}
            type="submit"
            onClick={() => { 
              i18n.changeLanguage(lng);
              window.location.reload();
            }}
          >
            {lngs[lng].nativeName}
          </button>
        ))}
      </header>
      <div className="min-h-full flex flex-col items-center justify-center overflow-hidden mt-20">
        <RetroGrid />
        <section id="header">
          <BlurFade delay={0.25} inView>
            <HyperText
              className="text-4xl font-bold text-black dark:text-white"
              text={t('translations.welcome')}
            />
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <span className="text-4xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none">
              <HyperText
                className="text-4xl font-bold text-black dark:text-white"
                text={t('translations.title')}
              />
            </span>
          </BlurFade>
        </section>
      </div>
      <div className="flex flex-row justify-center gap-10">
        <PulsatingButton className="mt-20 rounded-full" onClick={() => { navigate("/signup") }}>
          {t('translations.signUp')}
        </PulsatingButton>
        <PulsatingButton className="mt-20 rounded-full" onClick={() => { navigate("/signin") }}>
          {t('translations.logIn')}
        </PulsatingButton>
      </div>
    </div>
  );
};

export default LandingPage;
