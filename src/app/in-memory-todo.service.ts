import { InMemoryDbService } from 'angular-in-memory-web-api';
import { substractDays } from './model/todo.state';

export class InMemoryTodoService implements InMemoryDbService {

  constructor() { }

  desc1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
    + 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. '
    + 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
    + 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  desc2 = 'Raptim igitur properantes ut motus sui rumores celeritate nimia praevenirent, vigore corporum ac levitate confisi per '
    + 'flexuosas semitas ad summitates collium tardius evadebant. et cum superatis difficultatibus arduis ad supercilia venissent fluvii '
    + 'Melanis alti et verticosi, qui pro muro tuetur accolas circumfusus, augente nocte adulta terrorem quievere paulisper lucem '
    + 'opperientes. arbitrabantur enim nullo inpediente transgressi inopino adcursu adposita quaeque vastare, sed in cassum labores '
    + 'pertulere gravissimos.';

  desc3 = 'Verum ad istam omnem orationem brevis est defensio. Nam quoad aetas M. Caeli dare potuit isti suspicioni locum, fuit '
    + 'primum ipsius pudore, deinde etiam patris diligentia disciplinaque munita. Qui ut huic virilem togam deditšnihil dicam hoc loco de '
    + 'me; tantum sit, quantum vos existimatis; hoc dicam, hunc a patre continuo ad me esse deductum; nemo hunc M. Caelium in illo aetatis '
    + 'flore vidit nisi aut cum patre aut mecum aut in M. Crassi castissima domo, cum artibus honestissimis erudiretur.';

  desc4 = 'Post hoc impie perpetratum quod in aliis quoque iam timebatur, tamquam licentia crudelitati indulta per suspicionum '
    + 'nebulas aestimati quidam noxii damnabantur. quorum pars necati, alii puniti bonorum multatione actique laribus suis extorres '
    + 'nullo sibi relicto praeter querelas et lacrimas, stipe conlaticia victitabant, et civili iustoque imperio ad voluntatem converso '
    + 'cruentam, claudebantur opulentae domus et clarae. Fuerit toto in consulatu sine provincia, cui fuerit, antequam designatus est, '
    + 'decreta provincia.Sortietur an non ? Nam et non sortiri absurdum est, et, quod sortitus sis, non habere.Proficiscetur paludatus ? '
    + 'Quo ? Quo pervenire ante certam diem non licebit.ianuario, Februario, provinciam non habebit; Kalendis ei denique Martiis nascetur '
    + 'repente provincia.';

  createDb() {
    const todos = [
      {
        id: 1,
        title: 'Apprendre NgRx',
        state: 'DONE',
        description: this.desc1,
        creationDate: substractDays(new Date(), 5),
        doneDate: substractDays(new Date(), 1)
      },
      {
        id: 2,
        title: 'Organiser un workshop avec la WebFactory',
        state: 'UNDONE',
        description: this.desc2,
        creationDate: substractDays(new Date(), 2)
      },
      {
        id: 3, title: 'Traiter les MRs de Mike', state: 'UNDONE', description: this.desc3,
        creationDate: substractDays(new Date(), 1)
      },
      { id: 4, title: 'Prévoir un resto de fin de Sprint', state: 'UNDONE', description: this.desc4, creationDate: new Date() }
    ];
    return { todos };
  }

}
