import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: {
        welcomeBack: "Welcome back",
        activeChallenges: "Active Challenges",
        noActiveChallenges: "No active challenges",
        glofiTokens: "GLOFI Tokens",
        tokenValue: "Token value",
        holdingsValue: "Holdings value",
        usdcDeposited: "USDC Deposited",
        yourShare: "Your share",
        poolSize: "Pool size",
        totalEarnings: "Total Earnings",
        lifetimeReturns: "Lifetime returns",
        yourChallenges: "Your Challenges",
        newChallenge: "+ New Challenge",
        noActiveChallengesYet: "No active challenges yet.",
        startChallenge: "Start a Challenge",
        yourInvestment: "Your Investment",
        depositUsdc: "+ Deposit USDC",
        noInvestmentsYet: "No investments yet. Deposit USDC to start earning.",
        investInPool: "Invest in the Pool",
        activeProposals: "Active Proposals",
        viewAll: "View All",
        active: "ACTIVE",
        proposal1Title: "Proposal #1 — Set Trader Profit Split to 80%",
        endsIn3Days: "Ends in 3 days",
        proposal1Desc: "Sets the default profit split for funded traders to 80%. Remaining 20% split between liquidity pool (15%) and platform treasury (5%).",
        for67: "For — 67%",
        against33: "Against — 33%",
        votedFor: "✓ You voted For this proposal",
        votedAgainst: "✓ You voted Against this proposal",
        voteFor: "Vote For",
        voteAgainst: "Vote Against",
        proposal2Title: "Proposal #2 — Add Staking Challenge Tier",
        endsIn5Days: "Ends in 5 days",
        proposal2Desc: "Introduces staking-based challenge entry where traders lock governance tokens instead of paying a flat fee. On pass, stake returned. On fail, slashed to pool.",
        for89: "For — 89%",
        against11: "Against — 11%",
        loadingChallenges: "Loading challenges...",
        challengeNumber: "Challenge #{{id}}",
        accountSize: "Account Size",
        tradingDays: "Trading Days",
        profitTarget: "Profit Target",
        statusActive: "Active",
        statusPassed: "Passed",
        statusFailed: "Failed",
        statusClosed: "Closed",
        statusUnknown: "Unknown",
        tier1: "Tier 1",
        tier2: "Tier 2",
        tier3: "Tier 3"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
