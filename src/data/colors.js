export const brandColors = [['Rouge','#E50000'],['Corail','#F8664D'],['Ardoise','#1A252C'],['Gris perle','#C6CBD4'],['Nuage','#F7F7F7'],['Blanc','#FFFFFF']];

export const shades = [['Rouge',[['Foncé','#A00000','Bouton actif ou survolé, texte rouge sur fond clair'],['Base','#E50000','Accent, alertes'],['Clair','#F28080','Fond léger d’alerte, bouton rouge désactivé']]],
        ['Corail',[['Foncé','#EA4B3F','Bouton survolé ou actif, grands textes corail sur fond clair'],['Base','#F8664D','Couleur de contraste, boutons principaux'],['Clair','#FCB3A6','Fond léger de mise en avant, bouton corail désactivé']]]];

export const statusColors = [['Info',['#00548C','#0078C8','#80BCE4']],['Succès',['#11703F','#18A05A','#8CD0AC']],['Attention',['#936A00','#F5B000','#FAD880']],['Erreur',['#A00000','#E50000','#F28080']]];

export const backgrounds = [['Blanc','#FFFFFF','Ardoise, Rouge foncé, Corail foncé'],['Nuage','#F7F7F7','Ardoise, Rouge foncé, Corail foncé'],['Gris perle','#C6CBD4','Ardoise'],['Corail','#F8664D','Blanc (boutons), Ardoise'],['Corail clair','#FCB3A6','Ardoise'],['Rouge','#E50000','Blanc'],['Rouge clair','#F28080','Ardoise'],['Ardoise','#1A252C','Blanc, Gris perle, Corail']];

export const contrastColors = [...brandColors, ['Rouge foncé', '#A00000'], ['Rouge clair', '#F28080'], ['Corail foncé', '#EA4B3F'], ['Corail clair', '#FCB3A6']];

export const shadeLabels = ['Foncé', 'Base', 'Clair'];

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function contrastRatio(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function swatchInk(hex) {
  return contrastRatio(hex, '#1A252C') >= contrastRatio(hex, '#FFFFFF') ? '#1A252C' : '#FFFFFF';
}

export function contrastResult(foreground, background) {
  const value = contrastRatio(foreground, background);
  const bodyPass = value >= 4.5;
  const largePass = value >= 3;
  return {
    value: value.toFixed(2).replace('.', ','),
    tone: largePass ? 'v-ok' : 'v-no',
    icon: bodyPass ? 'check-circle' : largePass ? 'alert' : 'x-circle',
    verdict: bodyPass ? 'Autorisé pour tous les textes' : largePass ? 'Grands textes uniquement' : 'Interdit pour du texte',
    detail: `Texte courant : ${bodyPass ? 'réussi' : 'échoué'} (4,5 : 1) · Grand texte : ${largePass ? 'réussi' : 'échoué'} (3 : 1)`,
  };
}
