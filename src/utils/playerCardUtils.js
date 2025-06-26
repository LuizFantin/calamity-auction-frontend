
export function canPick(playerNationality, captainNationality, playerPlayWithAnotherLanguageA) {

  // If nationalities are different, the player must be able to play with another language
  if (playerPlayWithAnotherLanguageA) {
    return true;
  }
  // If nationalities are equal, always allow
  if (playerNationality === "BR" && captainNationality === "BR") {
    return true;
  }

  // If player and captain are from different countries, allow if neither is BR
  if( playerNationality !== "BR" && captainNationality !== "BR") {
      return true;
  }

  // Otherwise, don't allow
  return false;
}

export const getFlagImage = (countryCode) => {
  const flagUrl = `/flags/${countryCode.toLowerCase()}_flag.png`;
  return (
    <img
      src={flagUrl}
      alt={`${countryCode} flag`}
      className="player-icon"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/flags/unknown_flag.png"; // fallback image
      }}
    />
  );
};

// export const getEloImage = (elo) => {
//   const eloUrl = `/elos/${elo.toLowerCase()}.png`;
//   return (
//     <img
//       src={eloUrl}
//       alt={`${elo} elo`}
//       className="player-icon"
//       onError={(e) => {
//         e.target.onerror = null;
//         e.target.src = "/elos/gold.png"; // fallback image
//       }}
//     />
//   );
// };

export const getRoleImage = (role) => {
  const roleUrl = `/roles/${role.toLowerCase()}.png`;
  return (
    <img
      src={roleUrl}
      alt={`${role} role`}
      className="player-icon"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/roles/unknown_role.png"; // fallback image
      }}
    />
  );
};

export const getSpokenLanguages = (languageCodes) => {
  return languageCodes.map((langCode) => {
    const flagUrl = `/flags/${langCode.toLowerCase()}_flag.png`;
    return (
      <img
        key={langCode}
        src={flagUrl}
        alt={`${langCode} flag`}
        className="player-icon lang"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/flags/unknown_flag.png"; // fallback image
        }}
      />
    );
  });
};