const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const listWithOneBlog = [
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 100,
        id: '664505a4440fe4a5d5e525df',
      },
    ];

    const result = listHelper.totalLikes(listWithOneBlog);

    assert.strictEqual(result, 100);
  });

  test('of bigger list is calculated right', () => {
    const listWithMoreThanOneList = [
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 100,
        id: '664505a4440fe4a5d5e525df',
      },
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 100,
        id: '66450f0e73bd23bb2e200aad',
      },
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 100,
        id: '66451108cbfcc064ed5c79d0',
      },
    ];
    const result = listHelper.totalLikes(listWithMoreThanOneList);
    assert.strictEqual(result, 300);
  });
});

describe('Favorite blog', () => {
  test('returns favorite blog', () => {
    const blogs = [
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 100,
        id: '664505a4440fe4a5d5e525df',
      },
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 200,
        id: '66450f0e73bd23bb2e200aad',
      },
      {
        title: 'Fullstack',
        author: 'Muhammad Bashir',
        url: '**************',
        likes: 100,
        id: '66451108cbfcc064ed5c79d0',
      },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: 'Fullstack',
      author: 'Muhammad Bashir',
      url: '**************',
      likes: 200,
      id: '66450f0e73bd23bb2e200aad',
    });
  });
});
