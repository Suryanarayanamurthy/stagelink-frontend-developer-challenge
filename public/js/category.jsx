var app = app || {};

(function () {
  'use strict';

  app.TodoCategory = React.createClass({
    render: function () {
      var nowShowing = this.props.nowShowing;
      return (
        <section className="activeCat">
          <ul className="categoriesList">
            <li>
              <a
                href="#/all_categories"
                className={classNames({selected: nowShowing === app.ALL_TODOS})}>
                  All
              </a>
            </li>
            {' '}
            <li>
              <a
                href="#/category_work"
                className={classNames({selected: nowShowing === app.CAT_WORK})}>
                  URGENT
              </a>
            </li>
            {' '}
            <li>
              <a
                href="#/category_personal"
                className={classNames({selected: nowShowing === app.CAT_PERSONAL})}>
                  SOON
              </a>
            </li>
            {' '}
            <li>
              <a
                href="#/category_superpersonal"
                className={classNames({selected: nowShowing === app.CAT_SUPERPERSONAL})}>
                  ANYTIME
              </a>
            </li>
          </ul>
        </section>
      );
    }
  });
})();
